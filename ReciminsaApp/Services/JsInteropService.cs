using Microsoft.JSInterop;
using System.Threading.Tasks;
using System;

namespace ReciminsaApp.Services;

public static class JsInteropService
{
    private static DatabaseService _dbService = new DatabaseService();

    [JSInvokable]
    public static async Task<int> SaveOfflineRecord(string tableName, string dataJson)
    {
        var record = new Models.OfflineRecord
        {
            TableName = tableName,
            DataJson = dataJson,
            IsSynced = false,
            CreatedAt = DateTime.UtcNow
        };
        return await _dbService.SaveRecordAsync(record);
    }

    [JSInvokable]
    public static async Task<string> GetUnsyncedRecords()
    {
        var records = await _dbService.GetUnsyncedRecordsAsync();
        return System.Text.Json.JsonSerializer.Serialize(records);
    }
    
    [JSInvokable]
    public static async Task MarkAsSynced(int id)
    {
        var record = await _dbService.GetRecordAsync(id);
        if(record != null)
        {
            record.IsSynced = true;
            await _dbService.SaveRecordAsync(record);
        }
    }
}
