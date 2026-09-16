import os
import re

directories = ['src/components', 'src/pages', 'src']

replacements = {
    r'bg-canvas': 'bg-navy-900',
    r'text-forest-900': 'text-white',
    r'text-forest-800': 'text-sky-50',
    r'bg-forest-900': 'bg-navy-950',
    r'bg-forest-800': 'bg-navy-900',
    r'border-forest-800': 'border-navy-800',
    r'text-charcoal-900': 'text-white',
    r'text-charcoal-700': 'text-sky-100',
    r'text-charcoal-600': 'text-sky-200',
    r'text-charcoal-500': 'text-sky-300',
    r'text-charcoal-400': 'text-sky-400',
    r'bg-white/95': 'bg-navy-800/95',
    r'bg-white': 'bg-navy-800',
    r'border-cream-300': 'border-panel-700',
    r'border-cream-400': 'border-panel-600',
    r'border-cream-200': 'border-panel-800',
    r'bg-cream-100': 'bg-navy-900',
    r'bg-cream-50': 'bg-navy-800',
    r'bg-cream-300': 'bg-panel-600',
    
    r'bg-sage-100': 'bg-panel-800',
    r'bg-sage-200': 'bg-panel-700',
    r'bg-sage-300': 'bg-panel-600',
    r'bg-sage-400': 'bg-panel-500',
    r'bg-sage-500': 'bg-neon-500',
    r'bg-sage-600': 'bg-neon-600',
    r'border-sage-200': 'border-panel-600',
    r'border-sage-400': 'border-panel-400',
    r'text-sage-200': 'text-neon-200',
    r'text-sage-400': 'text-neon-400',
    r'text-sage-500': 'text-neon-500',
    r'text-sage-600': 'text-neon-500',
    r'text-sage-700': 'text-neon-600',
    r'shadow-sage': 'shadow-neon',
    r'ring-sage-100': 'ring-panel-800',
    
    r'bg-terracotta-50': 'bg-sky-900/50',
    r'bg-terracotta-100': 'bg-sky-800',
    r'bg-terracotta-500': 'bg-sky-500',
    r'bg-terracotta-600': 'bg-sky-600',
    r'border-terracotta-100': 'border-sky-800',
    r'border-terracotta-200': 'border-sky-700',
    r'text-terracotta-400': 'text-sky-400',
    r'text-terracotta-500': 'text-sky-500',
    r'text-terracotta-700': 'text-sky-300',
    r'text-terracotta-800': 'text-sky-200',
    r'shadow-terracotta': 'shadow-sky',
    r'ring-terracotta-100': 'ring-sky-900',
    
    r'shadow-warm-lg': 'shadow-neon-lg',
    r'shadow-warm': 'shadow-neon',
    r'bg-amber-100': 'bg-amber-900/40',
    r'border-amber-200': 'border-amber-700',
    r'text-amber-700': 'text-amber-400',
    r'text-amber-800': 'text-amber-300',
    r'bg-amber-50': 'bg-amber-950',
    
    r'bg-blue-100': 'bg-blue-900/40',
    r'border-blue-200': 'border-blue-700',
    r'text-blue-700': 'text-blue-400',
    
    r'bg-emerald-100': 'bg-emerald-900/40',
    r'border-emerald-200': 'border-emerald-700',
    r'text-emerald-700': 'text-emerald-400',
}

def process_file(filepath):
    if not filepath.endswith('.jsx') and not filepath.endswith('.css'):
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for d in directories:
    for root, _, files in os.walk(d):
        for file in files:
            process_file(os.path.join(root, file))

print("Done.")
