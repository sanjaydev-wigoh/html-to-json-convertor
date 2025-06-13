
1. **Run Development Server**
   Execute the following command to start the development server:

   bash
   npm run dev
  

2. **Copy Widgets JSON**

   * Navigate to the `dummy-sections` folder.
   * Copy the `widgets.json` file.
   * Paste it into the **first section** of the application.
   * This will convert your raw HTML widgets into `{{template-n}}` placeholders.
   * A `template.json` file will be generated and stored.

3. **Paste Converted Template HTML**

   * Copy the newly converted template HTML.
   * Paste it into the **next input section** of the application.

4. **Add Layout JSON**

   * Go back to the `dummy-sections` folder.
   * Copy the `layout.json` file.
   * Paste it into the **Computed Styles input section**.

5. **Convert to Bare Minimum**

   * Click the **"Convert into Bare Minimum"** button.
   * This will generate the **bare minimum HTML** and **bare minimum JSON**.

6. **Rebuild Site**

   * Copy the generated **bare minimum HTML**.
   * Paste it into the **Rebuild input section**.
   * Click the **"Rebuild"** button.
   * The system will match the `{{template-n}}` placeholders, retrieve the appropriate widgets, and rebuild the final version of your site.

