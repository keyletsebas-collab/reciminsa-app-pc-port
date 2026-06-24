using System.Text.Json;
using System.Net.Http;

namespace ReciminsaApp;

public partial class MainPage : ContentPage
{
    private const string CurrentVersion = "v1.0.14";
    // Nota: Reemplaza esta URL con la ruta final donde alojes tu version.json (puede ser un Bucket público en Supabase o Github)
    private const string UpdateCheckUrl = "https://raw.githubusercontent.com/keyletsebas-collab/ecorecicla/main/version.json"; 

    public MainPage()
    {
        InitializeComponent();
        blazorWebView.BlazorWebViewInitialized += BlazorWebView_BlazorWebViewInitialized;
    }

    private void BlazorWebView_BlazorWebViewInitialized(object sender, Microsoft.AspNetCore.Components.WebView.BlazorWebViewInitializedEventArgs e)
    {
        e.WebView.CoreWebView2.WebMessageReceived += CoreWebView2_WebMessageReceived;
    }

    private async void CoreWebView2_WebMessageReceived(object sender, Microsoft.Web.WebView2.Core.CoreWebView2WebMessageReceivedEventArgs e)
    {
        try
        {
            var json = e.TryGetWebMessageAsString();
            if (!string.IsNullOrEmpty(json))
            {
                var message = JsonSerializer.Deserialize<WebMessage>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (message != null && message.Action == "download")
                {
                    string downloadsPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads");
                    string safeFileName = message.Filename.Replace("/", "_").Replace("\\", "_");
                    string filePath = Path.Combine(downloadsPath, safeFileName);
                    
                    // Asegurar nombre único
                    int count = 1;
                    string fileNameOnly = Path.GetFileNameWithoutExtension(safeFileName);
                    string extension = Path.GetExtension(safeFileName);
                    while (File.Exists(filePath))
                    {
                        filePath = Path.Combine(downloadsPath, $"{fileNameOnly} ({count}){extension}");
                        count++;
                    }

                    byte[] fileBytes = Convert.FromBase64String(message.Data);
                    await File.WriteAllBytesAsync(filePath, fileBytes);

                    // Abrir en el navegador/programa por defecto
                    await Launcher.OpenAsync(new OpenFileRequest
                    {
                        File = new ReadOnlyFile(filePath)
                    });
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error descargando archivo: " + ex.Message);
        }
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        CheckForUpdatesAsync();
    }

    private async void CheckForUpdatesAsync()
    {
        try
        {
            using var client = new HttpClient();
            var response = await client.GetStringAsync(UpdateCheckUrl);
            
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var updateInfo = JsonSerializer.Deserialize<UpdateInfo>(response, options);
            
            if (updateInfo != null && IsNewerVersion(updateInfo.Version, CurrentVersion))
            {
                bool answer = await DisplayAlert(
                    "¡Actualización Disponible!", 
                    $"Hay una nueva versión de Reciminsa App ({updateInfo.Version}). ¿Deseas descargarla e instalarla ahora?", 
                    "Descargar e Instalar", "Más tarde");
                    
                if (answer)
                {
                    await Launcher.OpenAsync(updateInfo.DownloadUrl);
                }
            }
        }
        catch (Exception)
        {
            // Si no hay internet, simplemente fallará de forma silenciosa para que la app offline no se detenga.
        }
    }

    private bool IsNewerVersion(string remoteVersion, string localVersion)
    {
        if (string.IsNullOrEmpty(remoteVersion) || string.IsNullOrEmpty(localVersion)) return false;
        
        remoteVersion = remoteVersion.Replace("v", "");
        localVersion = localVersion.Replace("v", "");
        var remoteParts = remoteVersion.Split('.');
        var localParts = localVersion.Split('.');
        
        for (int i = 0; i < Math.Min(remoteParts.Length, localParts.Length); i++)
        {
            if (int.TryParse(remoteParts[i], out int rv) && int.TryParse(localParts[i], out int lv))
            {
                if (rv > lv) return true;
                if (rv < lv) return false;
            }
        }
        return false;
    }
}

public class UpdateInfo
{
    public string Version { get; set; }
    public string DownloadUrl { get; set; }
}

public class WebMessage
{
    public string Action { get; set; }
    public string Filename { get; set; }
    public string Data { get; set; }
}
