#!/bin/bash

# Script to create a new React component following the latest-insight pattern
# Usage: ./create-component.sh ComponentName [path]
# Default path: components/general
# Example: ./create-component.sh MyNewComponent
# Example with custom path: ./create-component.sh MyNewComponent components/features

if [ -z "$1" ]; then
  echo "Error: Component name is required"
  echo "Usage: ./create-component.sh ComponentName [path]"
  echo "Example: ./create-component.sh MyNewComponent"
  echo "Example with custom path: ./create-component.sh MyNewComponent components/features"
  exit 1
fi

COMPONENT_NAME=$1
CUSTOM_PATH=${2:-"components/general"}  # Default to components/general if not provided
KEBAB_CASE=$(echo "$COMPONENT_NAME" | sed 's/\([A-Z]\)/-\1/g' | sed 's/^-//' | tr '[:upper:]' '[:lower:]')
COMPONENT_DIR="src/$CUSTOM_PATH/$KEBAB_CASE"

# Check if component already exists
if [ -d "$COMPONENT_DIR" ]; then
  echo "Error: Component '$COMPONENT_NAME' already exists at $COMPONENT_DIR"
  exit 1
fi

echo "Creating component: $COMPONENT_NAME"
echo "Directory: $COMPONENT_DIR"

# Create the component directory
mkdir -p "$COMPONENT_DIR"

# Create index.ts
cat > "$COMPONENT_DIR/index.ts" << EOF
export { default } from './$KEBAB_CASE';
EOF

# Create types file
cat > "$COMPONENT_DIR/$KEBAB_CASE.types.ts" << EOF
export type ${COMPONENT_NAME}Props = {

}
EOF

# Create component file
cat > "$COMPONENT_DIR/$KEBAB_CASE.tsx" << EOF
"use client";

import { ${COMPONENT_NAME}Props } from "./$KEBAB_CASE.types";

const ${COMPONENT_NAME}: React.FC<${COMPONENT_NAME}Props> = (props) => {
    return (
      <div />

     
    );
};

export default ${COMPONENT_NAME};
EOF

echo "✅ Component created successfully!"
echo ""
echo "Files created:"
echo "  - $COMPONENT_DIR/index.ts"
echo "  - $COMPONENT_DIR/$KEBAB_CASE.types.ts"
echo "  - $COMPONENT_DIR/$KEBAB_CASE.tsx"
echo ""
echo "Import with: import $COMPONENT_NAME from '@/$CUSTOM_PATH/$KEBAB_CASE';"
