using SQLite;
using System;

namespace ReciminsaApp.Models;

public class OfflineRecord
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    public string TableName { get; set; }
    public string DataJson { get; set; }
    public bool IsSynced { get; set; }
    public DateTime CreatedAt { get; set; }
}
