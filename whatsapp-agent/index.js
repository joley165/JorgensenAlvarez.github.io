require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { GoogleGenAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'dracotoken123';

// Initialize Gemini Client
let genAI;
try {
    if (GEMINI_API_KEY) {
        genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    }
} catch (e) {
    console.error("Error inicializando Gemini SDK:", e.message);
}

// In-memory chat history map: phone_number -> array of chat history objects
const chatSessions = new Map();

// Rules and business instructions for Jorgensen's Lead AI Agent
const SYSTEM_INSTRUCTION = `
Eres "Draco Assistant", el agente de Inteligencia Artificial oficial de Jorgensen Alvarez, desarrollador experto en aplicaciones móviles de alto nivel.
Tu objetivo principal es recibir mensajes de clientes potenciales en WhatsApp, responder sus consultas con total profesionalismo, asesorarles sobre su aplicación e inducirlos a cotizar y agendar un proyecto.

INFORMACIÓN DE JORGENSEN ALVAREZ:
- Especialidad principal: Android Studio (Kotlin/Java nativo) y Xcode (Swift nativo) para aplicaciones robustas y de alto rendimiento.
- Especialidad híbrida: React Native (TypeScript) para soluciones multiplataforma consistentes.
- App de Referencia: Creador de "Draco", una plataforma social y comercial disponible en Google Play y Apple App Store.
- Contacto personal: +51 925 074 274 (Perú). Correo: jorgeluisalvarezpingo@hotmail.com

ESCALA DE PRESUPUESTOS Y TARIFAS (Valores en USD):
- Desarrollo Base Nativo (Android o iOS individual): $3,000 USD (mínimo).
- Desarrollo Base React Native (Multiplataforma): $4,500 USD.
- Adicionales por funciones avanzadas:
  * Videollamadas HD: +$1,200 USD
  * Llamadas de Voz: +$800 USD
  * Transmisiones en vivo: +$1,500 USD
  * Agentes de IA integrados: +$2,000 USD
  * Pantallas extra (a partir de la 3ª pantalla): +$150 USD por cada pantalla.

REGLAS DE COMPORTAMIENTO:
1. Mantén respuestas cortas, directas y amigables. No envíes bloques gigantes de texto. Usa listas con viñetas cuando sea apropiado.
2. Si un cliente está interesado, calcula un estimado rápido basado en lo que pide.
3. Si el cliente solicita hablar directamente con Jorgensen o agendar una llamada de requerimientos, indícale que has registrado sus datos y que Jorgensen se pondrá en contacto pronto, o facilítale su enlace directo de WhatsApp (+51 925 074 274).
`;

// GET /webhook: Verification endpoint for Meta Webhook setup
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verificado exitosamente por Meta.');
            res.status(200).send(challenge);
        } else {
            console.warn('Fallo en la verificación del token de webhook.');
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
});

// POST /webhook: Receives incoming WhatsApp messages
app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;

        // Verify if it's a message event from WhatsApp Business API
        if (body.object === 'whatsapp_business_account' && body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
            const messageObj = body.entry[0].changes[0].value.messages[0];
            const senderPhone = messageObj.from; // Sender's phone number
            const messageText = messageObj.text ? messageObj.text.body : null;

            if (messageText) {
                console.log(`Mensaje recibido de ${senderPhone}: "${messageText}"`);

                // Get or initialize conversation session history
                if (!chatSessions.has(senderPhone)) {
                    chatSessions.set(senderPhone, []);
                }
                const history = chatSessions.get(senderPhone);

                // Generate response using Gemini AI
                let aiResponseText = "Hola. En este momento no puedo procesar tu solicitud, pero Jorgensen te responderá muy pronto.";
                
                if (genAI) {
                    try {
                        const model = genAI.getGenerativeModel({ 
                            model: 'gemini-flash-latest',
                            systemInstruction: SYSTEM_INSTRUCTION
                        });

                        // Append user message to history
                        history.push({ role: 'user', parts: messageText });

                        // Run generation
                        const result = await model.generateContent({
                            contents: history
                        });
                        
                        const response = await result.response;
                        aiResponseText = response.text();

                        // Append model response to history
                        history.push({ role: 'model', parts: aiResponseText });

                        // Cap history size to avoid token overflow (keep last 12 messages)
                        if (history.length > 12) {
                            history.splice(0, 2);
                        }
                    } catch (aiErr) {
                        console.error("Error generando contenido con Gemini:", aiErr.message);
                    }
                }

                // Send message back to WhatsApp client
                await sendWhatsAppMessage(senderPhone, aiResponseText);
            }
            res.sendStatus(200);
        } else {
            // Return 200 to status updates or other events to avoid Meta retries
            res.sendStatus(200);
        }
    } catch (error) {
        console.error("Error procesando Webhook POST:", error.message);
        res.sendStatus(500);
    }
});

// Helper function to send messages via WhatsApp Cloud API
async function sendWhatsAppMessage(toPhone, textBody) {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        console.warn("Faltan credenciales de WhatsApp en el archivo .env. Mensaje no enviado.");
        return;
    }

    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
    
    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: toPhone,
        type: "text",
        text: {
            preview_url: false,
            body: textBody
        }
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`Mensaje enviado a ${toPhone}. Message ID: ${response.data.messages[0].id}`);
    } catch (err) {
        console.error("Error enviando mensaje a la API de WhatsApp:", err.response ? err.response.data : err.message);
    }
}

// Health check endpoint
app.get('/status', (req, res) => {
    res.status(200).json({
        status: "online",
        geminiConfigured: !!GEMINI_API_KEY,
        whatsappConfigured: !!WHATSAPP_TOKEN && !!PHONE_NUMBER_ID,
        sessionsCount: chatSessions.size
    });
});

app.listen(PORT, () => {
    console.log(`Servidor de WhatsApp AI Agent iniciado en el puerto ${PORT}`);
});
