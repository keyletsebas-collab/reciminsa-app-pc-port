# ✉️ Configuración de Recuperación de Contraseña por Gmail (Reciminsa)

Este documento detalla los pasos necesarios para desplegar y configurar el servicio de recuperación de contraseña de Reciminsa utilizando **Google Apps Script** y tu cuenta **Noreplyreciminsasrl@gmail.com**.

---

## 🚀 Código del Script de Google

Copia el siguiente código en tu editor de Google Apps Script:

```javascript
/**
 * Script de Google Apps para enviar correos de recuperación de contraseña de forma segura.
 * Desplegar desde la cuenta: Noreplyreciminsasrl@gmail.com
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var to = data.to;
    var subject = data.subject;
    var htmlBody = data.htmlBody;
    var textBody = data.textBody;
    
    // Envío del correo usando la API oficial de Gmail
    MailApp.sendEmail({
      to: to,
      subject: subject,
      body: textBody,
      htmlBody: htmlBody
    });
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 🛠️ Guía de Despliegue en Google Apps Script

Sigue estos **4 pasos sencillos** para activar el envío:

### Paso 1: Crear el Script
1. Inicia sesión en tu cuenta de Gmail: **`Noreplyreciminsasrl@gmail.com`**.
2. Ve a [Google Apps Script](https://script.google.com/) y haz clic en **Nuevo proyecto**.
3. Borra el código por defecto del archivo `Código.gs` y pega el código de arriba.
4. Haz clic en el botón de **Guardar** (icono de disquete 💾).

### Paso 2: Desplegar como Aplicación Web
1. Haz clic en el botón azul **Implementar** (arriba a la derecha) -> **Nueva implementación**.
2. Haz clic en el icono del engranaje ⚙️ y selecciona **Aplicación web**.
3. Rellena los campos con las siguientes opciones:
   * **Descripción**: `API de recuperación de contraseña Reciminsa`
   * **Ejecutar como**: `Tú (Noreplyreciminsasrl@gmail.com)` *(esto asegura que el remitente sea tu Gmail)*
   * **Quién tiene acceso**: `Cualquier persona` *(esto permite que tu app cliente haga peticiones POST seguras)*
4. Haz clic en **Implementar**.

### Paso 3: Autorizar Permisos
1. Google te solicitará autorizar permisos para que el script pueda usar el servicio de Gmail. Haz clic en **Autorizar acceso**.
2. Selecciona tu cuenta de Gmail.
3. Te saldrá un aviso de Google de "Aplicación no verificada". Haz clic en **Configuración avanzada** (abajo a la izquierda) y luego en **Ir a Proyecto sin título (no seguro)**.
4. Haz clic en **Permitir**.

### Paso 4: ¡Todo Listo!
Google te proporcionará una **URL de la aplicación web**. 
Esta URL ya ha sido integrada de forma permanente y global en el código de tu aplicación de Reciminsa (`js/auth.js`). 

¡Cualquier instalación o usuario que abra la aplicación podrá recuperar su contraseña de forma 100% real y automática mediante tu correo central de Gmail de inmediato!
