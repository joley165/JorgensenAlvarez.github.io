# Guía de Instalación del Agente de IA para WhatsApp Business

Esta guía explica paso a paso cómo registrar tu aplicación en Meta (Facebook Developers), enlazar el número de teléfono de tu negocio y configurar tu servidor con Inteligencia Artificial.

---

## Requisitos Previos
1. Una cuenta de desarrollador en [Meta developers](https://developers.facebook.com/). Si no tienes una, inicia sesión con tu cuenta de Facebook y completa el registro básico.
2. Una API Key de Gemini. Consíguela en segundos en [Google AI Studio](https://aistudio.google.com/).
3. Tener instalado **Node.js** en tu Mac.

---

## Paso 1: Configurar la App en Meta (Facebook)
1. Ve al panel de **Mis aplicaciones** en el sitio de desarrolladores de Facebook.
2. Haz clic en **Crear aplicación**.
3. Selecciona la opción de **Otro** y pulsa "Siguiente".
4. Selecciona el tipo de aplicación como **Negocios** (Business) e ingresa un nombre (ej. `Draco AI Agent`).
5. Pulsa **Crear aplicación** (te solicitará tu contraseña de Facebook por seguridad).
6. Una vez dentro del panel de la aplicación, desplázate hacia abajo hasta encontrar **WhatsApp** y haz clic en **Configurar**.

---

## Paso 2: Obtener los Tokens de Prueba y IDs
Al activar WhatsApp, Meta te redirigirá a la pestaña de inicio de WhatsApp.
1. En la parte derecha, verás un bloque de información temporal:
   * **Identificador de número de teléfono (Phone Number ID):** Copia este número largo de 15 dígitos.
   * **Identificador de cuenta de WhatsApp Business:** Cópialo también.
   * **Token de acceso temporal:** Copia esta cadena de texto muy larga.
2. Abre tu archivo `.env` en `/Users/momo/Documents/antigravity/whatsapp-agent/.env` y rellena las variables:
   * Pega tu API Key de Gemini en `GEMINI_API_KEY`.
   * Pega el Token de acceso temporal en `WHATSAPP_ACCESS_TOKEN`.
   * Pega el Phone Number ID en `WHATSAPP_PHONE_NUMBER_ID`.
   * Elige un token de verificación inventado en `WHATSAPP_VERIFY_TOKEN` (por defecto he puesto `dracotoken123`).

---

## Paso 3: Iniciar el Servidor e Instalar Dependencias
Abre la terminal de tu Mac, dirígete a la carpeta del proyecto e instala los paquetes:

```bash
cd /Users/momo/Documents/antigravity/whatsapp-agent
npm install
npm start
```
Verás un mensaje en pantalla indicando:
> `Servidor de WhatsApp AI Agent iniciado en el puerto 3000`

---

## Paso 4: Exponer el Servidor a Internet usando Ngrok
Dado que WhatsApp requiere un enlace público con certificado de seguridad (HTTPS) para enviarte mensajes, usaremos **ngrok** para crear un túnel seguro temporal:

1. Si no tienes ngrok, instálalo en tu Mac abriendo otra pestaña de terminal y ejecutando:
   ```bash
   brew install ngrok/ngrok/ngrok
   ```
2. Ejecuta el túnel en el puerto 3000:
   ```bash
   ngrok http 3000
   ```
3. Ngrok te dará una dirección pública que empieza con **https** (ej. `https://1234-abcd.ngrok-free.app`). **Copia esa dirección completa**.

---

## Paso 5: Registrar el Webhook en Meta
1. Regresa al portal de Meta for Developers.
2. En la barra lateral izquierda, expande **WhatsApp** y haz clic en **Configuración** (Configuration).
3. En el bloque de **Webhook**, haz clic en **Editar**.
4. En **URL de devolución de llamada (Callback URL)**, pega la dirección HTTPS que copiaste de ngrok y agrégale al final `/webhook`.
   * Ejemplo: `https://1234-abcd.ngrok-free.app/webhook`
5. En **Token de verificación**, escribe el texto que configuraste en tu archivo `.env` (ej: `dracotoken123`).
6. Haz clic en **Guardar y verificar**. (El panel se comunicará con tu servidor local, lo verificará y guardará el webhook en verde).
7. En esa misma pantalla de Meta, haz clic en **Administrar** (Manage) al lado de las suscripciones a campos de webhook, busca el evento llamado **messages** y haz clic en **Suscribirse**.

---

## Paso 6: ¡Prueba tu Agente de IA!
1. En el panel de WhatsApp de Meta (sección de inicio rápido), en el apartado **Paso 1: Enviar y recibir mensajes**, añade tu número de teléfono personal como número de prueba autorizado.
2. Meta te enviará un código de verificación a tu WhatsApp. Ingrésalo.
3. Haz clic en el botón de enviar mensaje de prueba desde el portal o simplemente abre el chat de WhatsApp con el número de prueba de Meta.
4. Escríbele cualquier consulta sobre cotización de aplicaciones (ej: *"Hola, cuánto me cuesta una app híbrida con videollamada?"*).
5. Tu agente Draco Assistant procesará la consulta con Gemini y le responderá calculando el presupuesto de $4,500 USD de base React Native y sumará el extra de $1,200 USD por videollamada de forma automática.
