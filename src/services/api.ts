// URL de base de l'API (configurable via variable d'environnement)
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'https://devfront-bamboopay.ventis.group/api'

// Configuration du marchand (à configurer selon votre environnement)
// Note: Le merchant_id pourrait être le même que le username
const MERCHANT_CONFIG = {
  merchantId: process.env.VUE_APP_MERCHANT_ID || process.env.VUE_APP_API_USERNAME || '6008889',
  callbackUrl: process.env.VUE_APP_CALLBACK_URL || `${window.location.origin}/payment/callback`
}

// Configuration des identifiants API
const API_CREDENTIALS = {
  username: process.env.VUE_APP_API_USERNAME || '6008889',
  password: process.env.VUE_APP_API_PASSWORD || '12345678'
}

// Fonction pour créer l'en-tête d'authentification Basic
const getAuthHeaders = () => {
  const credentials = `${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`
  const encodedCredentials = btoa(credentials)
  return {
    'Authorization': `Basic ${encodedCredentials}`
  }
}

export interface PaymentRequest {
  phone: string
  amount: number
  payerName: string
  reference: string
  operateur?: 'moov_money' | 'airtel_money' | null
  eventId?: string
  eventTitle?: string
  quantity?: number
}

export interface PaymentResponse {
  success: boolean
  message?: string
  transactionId?: string
  reference?: string
  referenceBp?: string // Référence retournée par l'API BambooPay
  status?: string
  data?: any
  error?: {
    name?: string
    message?: string
    stack?: string
  }
}

export interface TransactionStatusResponse {
  success: boolean
  status?: string
  transactionId?: string
  message?: string
  data?: any
  error?: {
    name?: string
    message?: string
    stack?: string
  }
}

// Générer une référence unique pour la transaction
const generateReference = (eventId?: string): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9).toUpperCase()
  const prefix = eventId ? `EVT-${eventId}-` : 'TKT-'
  return `${prefix}${timestamp}-${random}`
}

export const paymentService = {
  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Générer une référence unique
      const reference = paymentData.reference || generateReference(paymentData.eventId)

      // Préparer les paramètres selon l'API
      const requestBody = {
        phone: paymentData.phone,
        amount: paymentData.amount.toString(), // L'API attend une string
        payer_name: paymentData.payerName,
        reference: reference,
        merchant_id: MERCHANT_CONFIG.merchantId,
        callback_url: MERCHANT_CONFIG.callbackUrl,
        operateur: paymentData.operateur || null
      }

      const url = `${API_BASE_URL}/mobile/instant-payment`
      console.log('Appel API:', url)
      console.log('Données envoyées:', requestBody)

      let response
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(requestBody),
          // Mode cors pour gérer les problèmes CORS
          mode: 'cors',
          // Credentials si nécessaire
          credentials: 'omit'
        })
      } catch (fetchError: any) {
        // Capturer les erreurs de fetch avant qu'elles ne remontent
        console.error('Erreur fetch:', fetchError)
        throw fetchError
      }

      // Vérifier si la réponse est valide avant de parser le JSON
      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        console.error('Réponse non-JSON:', text)
        return {
          success: false,
          message: 'Réponse invalide du serveur',
          reference: reference,
          data: { rawResponse: text }
        }
      }

      if (!response.ok) {
        // Gérer spécifiquement l'erreur 401 (Unauthorized)
        if (response.status === 401) {
          let errorMsg = 'Erreur d\'authentification.'
          
          // Vérifier si c'est un problème de merchant
          if (data.message && data.message.includes('Merchant')) {
            errorMsg = `Erreur: ${data.message}\n\n` +
              `Le merchant_id "${MERCHANT_CONFIG.merchantId}" n'est pas autorisé ou n'existe pas.\n\n` +
              `Vérifiez que vous avez configuré le bon merchant_id dans votre fichier .env.\n` +
              `Le merchant_id pourrait être le même que votre username (${API_CREDENTIALS.username}).`
          } else {
            errorMsg = 'Erreur d\'authentification. Vérifiez vos identifiants API (username/password).'
          }
          
          return {
            success: false,
            message: errorMsg,
            reference: reference,
            data
          }
        }
        return {
          success: false,
          message: data.message || data.error || 'Erreur lors du paiement',
          reference: reference,
          data
        }
      }

      return {
        success: true,
        message: data.message || 'Paiement initié avec succès',
        transactionId: data.transaction_id || data.transactionId || data.id,
        reference: reference,
        referenceBp: data.reference_bp || data.referenceBp, // Référence retournée par l'API
        status: data.status,
        data
      }
    } catch (error: any) {
      console.error('Erreur API paiement:', error)
      console.error('Type d\'erreur:', error.name, error.message)
      console.error('URL tentée:', `${API_BASE_URL}/mobile/instant-payment`)
      
      // Détecter différents types d'erreurs
      let errorMessage = 'Erreur de connexion. Veuillez réessayer.'
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = `Impossible de se connecter au serveur de paiement.\n\n` +
          `Causes possibles:\n` +
          `- Le serveur n'est pas accessible (${API_BASE_URL})\n` +
          `- Problème de connexion internet\n` +
          `- Problème CORS (Cross-Origin Resource Sharing)\n` +
          `- Le serveur est en maintenance\n\n` +
          `Veuillez vérifier votre connexion et réessayer.`
      } else if (error.message && error.message.includes('ERR_NAME_NOT_RESOLVED')) {
        errorMessage = `Impossible de résoudre le nom de domaine.\n\n` +
          `L'URL ${API_BASE_URL} n'est pas accessible.\n` +
          `Vérifiez que l'URL de l'API est correcte dans votre fichier .env`
      } else if (error.message && error.message.includes('NetworkError')) {
        errorMessage = 'Erreur réseau. Vérifiez votre connexion internet.'
      } else if (error.message) {
        errorMessage = `Erreur: ${error.message}`
      }
      
      return {
        success: false,
        message: errorMessage,
        reference: paymentData.reference || generateReference(paymentData.eventId),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      }
    }
  },

  async checkTransactionStatus(reference: string): Promise<TransactionStatusResponse> {
    try {
      if (!reference) {
        return {
          success: false,
          message: 'Référence de transaction manquante'
        }
      }

      const url = `${API_BASE_URL}/check-status/${reference}`
      console.log('Vérification statut:', url)

      let response
      try {
        // L'API attend un GET sur /check-status/{reference}
        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            ...getAuthHeaders()
          },
          mode: 'cors',
          credentials: 'omit'
        })
      } catch (fetchError: any) {
        console.error('Erreur fetch statut:', fetchError)
        throw fetchError
      }

      // Vérifier si la réponse est valide avant de parser le JSON
      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        console.error('Réponse non-JSON:', text)
        return {
          success: false,
          message: 'Réponse invalide du serveur',
          transactionId: reference,
          data: { rawResponse: text }
        }
      }

      if (!response.ok) {
        // Gérer spécifiquement l'erreur 401 (Unauthorized)
        if (response.status === 401) {
          return {
            success: false,
            message: 'Erreur d\'authentification. Vérifiez vos identifiants API.',
            transactionId: reference,
            data
          }
        }
        // 405 Method Not Allowed peut indiquer une méthode incorrecte sur l'endpoint
        if (response.status === 405) {
          return {
            success: false,
            message: 'Méthode HTTP non autorisée. L\'endpoint check-status attend une requête GET.',
            transactionId: reference,
            data
          }
        }
        return {
          success: false,
          message: data.message || data.error || 'Erreur lors de la vérification du statut',
          transactionId: reference,
          data
        }
      }

      return {
        success: true,
        status: data.status || data.transaction_status,
        transactionId: data.transaction_id || data.transactionId || reference,
        message: data.message || 'Statut récupéré avec succès',
        data
      }
    } catch (error: any) {
      console.error('Erreur vérification statut:', error)
      console.error('Type d\'erreur:', error.name, error.message)
      
      let errorMessage = 'Erreur de connexion lors de la vérification du statut.'
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = `Impossible de se connecter au serveur pour vérifier le statut.\n\n` +
          `Vérifiez votre connexion internet et que l'API est accessible: ${API_BASE_URL}`
      } else if (error.message && error.message.includes('ERR_NAME_NOT_RESOLVED')) {
        errorMessage = `Impossible de résoudre le nom de domaine: ${API_BASE_URL}`
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return {
        success: false,
        message: errorMessage,
        transactionId: reference,
        error: {
          name: error.name,
          message: error.message
        }
      }
    }
  }
}
