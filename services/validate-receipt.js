function validateReceipt(receipt) {
    // Check if all required fields exist
    if (!receipt.retailer || !receipt.purchaseDate || !receipt.purchaseTime || !receipt.items || !receipt.total) {
      return false;
    }
  
    // Validate retailer (alphanumeric, spaces, hyphens, and & only)
    if (!/^[\w\s\-&]+$/.test(receipt.retailer)) {
      return false;
    }
  
    // Validate purchaseDate (YYYY-MM-DD format)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(receipt.purchaseDate)) {
      return false;
    }
  
    // Validate purchaseTime (HH:MM format, 24-hour)
    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(receipt.purchaseTime)) {
      return false;
    }
  
    // Validate items array
    if (!Array.isArray(receipt.items) || receipt.items.length === 0) {
      return false;
    }
  
    // Validate each item
    for (const item of receipt.items) {
      if (!item.shortDescription || !item.price) {
        return false;
      }
  
      // Validate shortDescription (alphanumeric, spaces, and hyphens only)
      if (!/^[\w\s\-]+$/.test(item.shortDescription)) {
        return false;
      }
  
      // Validate price (format: XX.XX)
      if (!/^\d+\.\d{2}$/.test(item.price)) {
        return false;
      }
    }
  
    // Validate total (format: XX.XX)
    if (!/^\d+\.\d{2}$/.test(receipt.total)) {
      return false;
    }
  
    return true;
  }
  
  export { validateReceipt };
