# 🚗 Vehicle Dashboard - GitHub Pages Setup Guide

## 📋 Complete Setup Instructions

### Step 1: GitHub Repository Setup

1. **Create New Repository**
   ```
   - Go to github.com
   - Click "New Repository"
   - Name: "vehicle-dashboard"
   - Make it Public
   - Initialize with README
   ```

2. **Upload Files**
   ```
   Create these files in your repository:
   
   📁 Repository Structure:
   ├── index.html          (Main dashboard file)
   ├── dashboard.js        (JavaScript functionality)
   ├── README.md           (This guide)
   └── config.json         (Optional: default config)
   ```

### Step 2: Google Sheets API Setup 🔑

#### A. Enable Google Sheets API
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create new project or select existing one
3. Go to "APIs & Services" → "Library"
4. Search "Google Sheets API"
5. Click "Enable"

#### B. Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API Key (save it securely!)
4. Optional: Restrict API key to Google Sheets API only

#### C. Make Your Sheet Accessible
**Option 1: Public Sheet (Easiest)**
```
1. Open your Google Sheet
2. Click "Share" button
3. Change to "Anyone with the link can view"
4. Copy the Sheet ID from URL
```

**Option 2: Service Account (More Secure)**
```
1. Create Service Account in Google Console
2. Download JSON key file
3. Share sheet with service account email
4. Use service account for authentication
```

### Step 3: GitHub Pages Activation

1. **Enable GitHub Pages**
   ```
   - Go to your repository settings
   - Scroll to "Pages" section
   - Source: Deploy from branch
   - Branch: main/master
   - Folder: / (root)
   - Save
   ```

2. **Your website will be available at:**
   ```
   https://YOUR_USERNAME.github.io/vehicle-dashboard/
   ```

### Step 4: Configure Your Dashboard

1. **Open your live website**
2. **Enter Configuration:**
   ```
   API Key: [Your Google Sheets API Key]
   Sheet ID: 1eN1ftt0ONgvKgBXc6ei7WY4Jpm6-boRf5sEehujr_hg
   Ranges: Sheet1!A:J,Sheet2!A:J,Sheet3!A:J
   ```

3. **Save Configuration**
   - Settings are saved in browser localStorage
   - Each visitor needs to configure once

### Step 5: File Contents

#### index.html
```html
<!-- Copy the HTML content from the first artifact -->
```

#### dashboard.js
```javascript
// Copy the JavaScript content from the second artifact
```

#### Optional: config.json
```json
{
  "defaultSheetId": "1eN1ftt0ONgvKgBXc6ei7WY4Jpm6-boRf5sEehujr_hg",
  "defaultRanges": ["Sheet1!A:J", "Sheet2!A:J", "Sheet3!A:J"],
  "apiInstructions": "Get your API key from Google Cloud Console"
}
```

## 🔧 Customization Options

### 1. Change Sheet ID
```javascript
// In dashboard.js, modify the default sheet ID:
this.sheetId = 'YOUR_SHEET_ID_HERE';
```

### 2. Modify Sheet Ranges
```javascript
// Adjust which sheets and columns to read:
this.ranges = ['January!A:J', 'February!A:J', 'March!A:J'];
```

### 3. Customize Colors
```css
/* In index.html <style> section, modify CSS variables: */
:root {
    --primary: linear-gradient(135deg, #your-color 0%, #your-color2 100%);
    --success: linear-gradient(135deg, #your-success 0%, #your-success2 100%);
}
```

### 4. Add New Features
```javascript
// Add new functions to VehicleDashboard class in dashboard.js
class VehicleDashboard {
    // Your new methods here
}
```

## 🛠️ Troubleshooting

### Common Issues:

1. **"API Key Invalid"**
   ```
   - Check API key is correct
   - Ensure Google Sheets API is enabled
   - Verify API key restrictions
   ```

2. **"Sheet Not Found"**
   ```
   - Verify Sheet ID is correct
   - Check sheet is public or shared properly
   - Ensure sheet ranges exist
   ```

3. **"CORS Error"**
   ```
   - This shouldn't happen with GitHub Pages
   - If it does, check API key restrictions
   ```

4. **No Data Showing**
   ```
   - Check browser console for errors
   - Verify sheet has data in expected format
   - Check column mapping in processSheetData()
   ```

### Debug Mode:
```javascript
// Add to dashboard.js for debugging:
console.log('Debug mode enabled');
// Check browser console for detailed logs
```

## 📊 Data Format Requirements

Your Google Sheet should have these columns:
```
A: Date (e.g., "25 July", "26-Jul")
B: Location (e.g., "Mumbai", "Delhi")
C: Vehicle Number (e.g., "MH12AB1234")
D: Client Name (e.g., "Infants Transport")
E: Vehicle Type (e.g., "Bus", "Truck")
F: Installation Date
G: Working Status ("Active", "Offlline >24Hrs")
H: Recording Status
I: Alignment Status ("Alligned", "Misalligned")
J: Remarks
```

## 🚀 Performance Tips

1. **Optimize Sheet Size**
   - Remove empty rows/columns
   - Use consistent data format
   - Limit to necessary data only

2. **Cache Management**
   - Data is cached in browser
   - Use refresh button for new data
   - Clear cache if issues persist

3. **API Usage**
   - API has daily quotas
   - Consider caching for high traffic
   - Monitor usage in Google Console

## 🔒 Security Best Practices

1. **API Key Security**
   - Use API key restrictions
   - Consider service account for production
   - Never commit API keys to public repos

2. **Sheet Access**
   - Use view-only permissions
   - Consider private sheets with service account
   - Regular access review

3. **Data Privacy**
   - Ensure compliance with data regulations
   - Consider data anonymization
   - Regular security audits

## 📱 Mobile Optimization

The dashboard is fully responsive and works on:
- 📱 Mobile phones
- 📱 Tablets  
- 💻 Laptops
- 🖥️ Desktops

## 🎨 Customization Examples

### Change Company Name:
```html
<h1>🚗 YOUR COMPANY Vehicle Dashboard</h1>
```

### Add Logo:
```html
<div class="header">
    <img src="logo.png" alt="Logo" style="height: 50px;">
    <h1>Vehicle Dashboard</h1>
</div>
```

### Custom Favicon:
```html
<link rel="icon" type="image/x-icon" href="favicon.ico">
```

## 🔄 Auto-Refresh Setup

Add auto-refresh every 5 minutes:
```javascript
// Add to dashboard.js init():
setInterval(() => {
    this.refreshData();
}, 5 * 60 * 1000); // 5 minutes
```

## 📈 Analytics (Optional)

Add Google Analytics:
```html
<!-- Add before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🆘 Support

For issues:
1. Check browser console for errors
2. Verify Google Sheets API setup
3. Test with sample data
4. Check GitHub Pages deployment status

## 🎉 You're All Set!

Your beautiful vehicle dashboard is now live at:
**https://YOUR_USERNAME.github.io/vehicle-dashboard/**

### Features Working:
✅ Live Google Sheets data  
✅ Beautiful responsive design  
✅ Real-time statistics  
✅ Interactive charts  
✅ Client/Location analysis  
✅ Mobile-friendly interface  
✅ Dark/Light theme toggle  
✅ Export functionality  
✅ Search and filters  

Enjoy your professional vehicle dashboard! 🚗✨