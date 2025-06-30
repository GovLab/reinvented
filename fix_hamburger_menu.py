#!/usr/bin/env python3
"""
Script to fix hamburger menu issues across all HTML files in the reinvented project.
This script will:
1. Replace anchor tags with button tags for hamburger menus
2. Update onclick handlers from myFunction() to toggleMenu()
3. Replace myFunction() JavaScript with improved toggleMenu() implementation
"""

import os
import re
import glob

def fix_html_files():
    # Only target the reinvented directory
    target_dir = "/Volumes/scratchdisk/reinvented"
    
    if not os.path.exists(target_dir):
        print(f"❌ Target directory {target_dir} does not exist!")
        return
    
    # Find all HTML files in the reinvented directory recursively
    html_files = glob.glob(os.path.join(target_dir, "**/*.html"), recursive=True)
    
    # Track changes
    files_updated = 0
    total_files = len(html_files)
    
    print(f"🔍 Found {total_files} HTML files in {target_dir}")
    
    for file_path in html_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            changes_made = False
            
            # Fix 1: Replace anchor tag with button tag for hamburger menu
            # Pattern: <a href="javascript:void(0);" class="icon" onclick="myFunction()">
            # Replace with: <button type="button" class="icon" onclick="toggleMenu()" aria-label="Toggle navigation menu">
            pattern1 = r'<a href="javascript:void\(0\);"\s+class="icon"\s+onclick="myFunction\(\)">'
            replacement1 = '<button type="button" class="icon" onclick="toggleMenu()" aria-label="Toggle navigation menu">'
            
            if re.search(pattern1, content):
                content = re.sub(pattern1, replacement1, content)
                changes_made = True
                print(f"  🔧 Fixed anchor tag in {os.path.basename(file_path)}")
            
            # Fix 2: Replace closing </a> with </button> for the hamburger menu
            # Pattern: <i class="fa fa-bars"></i></a>
            # Replace with: <i class="fa fa-bars"></i></button>
            pattern2 = r'<i class="fa fa-bars"></i></a>'
            replacement2 = '<i class="fa fa-bars"></i></button>'
            
            if re.search(pattern2, content):
                content = re.sub(pattern2, replacement2, content)
                changes_made = True
                print(f"  🔧 Fixed closing tag in {os.path.basename(file_path)}")
            
            # Fix 3: Replace myFunction() JavaScript with toggleMenu() implementation
            # Find the myFunction() definition and replace it
            pattern3 = r'function myFunction\(\)\s*\{\s*var x = document\.getElementById\("myLinks"\);\s*if \(x\.style\.display === "block"\) \{\s*x\.style\.display = "none";\s*\} else \{\s*x\.style\.display = "block";\s*\}\s*\}'
            replacement3 = '''// Toggle menu function - cleaner implementation
  function toggleMenu() {
    const menu = document.getElementById("myLinks");
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  }

  // Close menu function
  function dismiss_menu() {
    const menu = document.getElementById("myLinks");
    menu.style.display = "none";
  }

  // Close menu when clicking outside of it
  document.addEventListener('click', function(event) {
    const menu = document.getElementById("myLinks");
    const menuButton = document.querySelector('.icon');
    
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
      menu.style.display = "none";
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      dismiss_menu();
    }
  });'''
            
            if re.search(pattern3, content, re.DOTALL):
                content = re.sub(pattern3, replacement3, content, flags=re.DOTALL)
                changes_made = True
                print(f"  🔧 Fixed JavaScript function in {os.path.basename(file_path)}")
            
            # If changes were made, write the file back
            if changes_made:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                files_updated += 1
                print(f"✅ Updated: {file_path}")
            
        except Exception as e:
            print(f"❌ Error processing {file_path}: {str(e)}")
    
    print(f"\n📊 Summary:")
    print(f"Total HTML files found: {total_files}")
    print(f"Files updated: {files_updated}")
    print(f"Files unchanged: {total_files - files_updated}")

def fix_css_files():
    """Add button styles to CSS files in the reinvented directory"""
    target_dir = "/Volumes/scratchdisk/reinvented"
    css_files = glob.glob(os.path.join(target_dir, "**/*.css"), recursive=True)
    
    print(f"\n🎨 Checking {len(css_files)} CSS files for button styles...")
    
    for css_file in css_files:
        try:
            with open(css_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if this CSS file has the .topnav a.icon rule
            if '.topnav a.icon' in content and '.topnav button.icon' not in content:
                # Add button styles before the existing a.icon rule
                button_styles = '''/* Style the hamburger menu */
.topnav button.icon {
  display: block;
  left: 0;
  top: 0;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 14px 16px;
  font-size: 17px;
}

'''
                
                # Insert button styles before the existing a.icon rule
                content = content.replace('.topnav a.icon {', button_styles + '.topnav a.icon {')
                
                with open(css_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Updated CSS: {css_file}")
                
        except Exception as e:
            print(f"❌ Error processing CSS {css_file}: {str(e)}")

if __name__ == "__main__":
    print("🔧 Starting hamburger menu fix for reinvented project...")
    fix_html_files()
    print("\n🎨 Updating CSS files with button styles...")
    fix_css_files()
    print("\n✨ Hamburger menu fix complete!") 