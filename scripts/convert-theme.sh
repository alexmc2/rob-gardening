#!/bin/bash

# Get the script's directory and go up to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

INPUT_FILE="$PROJECT_ROOT/theme/input.css"
OUTPUT_FILE="$PROJECT_ROOT/theme/theme.css"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Error: $INPUT_FILE not found"
    exit 1
fi

# Create theme directory if it doesn't exist
mkdir -p "$PROJECT_ROOT/theme"

# Read the input file
INPUT=$(cat "$INPUT_FILE")

# Determine if dark theme
if echo "$INPUT" | grep -q 'color-scheme: "dark"'; then
    SELECTOR=".dark"
else
    SELECTOR=":root"
fi

# Extract color values
BASE_100=$(echo "$INPUT" | grep -oP '(?<=--color-base-100: )[^;]+')
BASE_200=$(echo "$INPUT" | grep -oP '(?<=--color-base-200: )[^;]+')
BASE_300=$(echo "$INPUT" | grep -oP '(?<=--color-base-300: )[^;]+')
BASE_CONTENT=$(echo "$INPUT" | grep -oP '(?<=--color-base-content: )[^;]+')
PRIMARY=$(echo "$INPUT" | grep -oP '(?<=--color-primary: )[^;]+')
PRIMARY_CONTENT=$(echo "$INPUT" | grep -oP '(?<=--color-primary-content: )[^;]+')
SECONDARY=$(echo "$INPUT" | grep -oP '(?<=--color-secondary: )[^;]+')
SECONDARY_CONTENT=$(echo "$INPUT" | grep -oP '(?<=--color-secondary-content: )[^;]+')
ACCENT=$(echo "$INPUT" | grep -oP '(?<=--color-accent: )[^;]+')
ACCENT_CONTENT=$(echo "$INPUT" | grep -oP '(?<=--color-accent-content: )[^;]+')
ERROR=$(echo "$INPUT" | grep -oP '(?<=--color-error: )[^;]+')
ERROR_CONTENT=$(echo "$INPUT" | grep -oP '(?<=--color-error-content: )[^;]+')

# Write output
cat > "$OUTPUT_FILE" << EOF
$SELECTOR {
  --background: $BASE_100;               /* base-100 */
  --foreground: $BASE_CONTENT;               /* base-content */

  --card: $BASE_200;                     /* base-200 */
  --card-foreground: $BASE_CONTENT;          /* base-content */
  --popover: $BASE_100;                  /* base-100 */
  --popover-foreground: $BASE_CONTENT;       /* base-content */

  --primary: $PRIMARY;                  /* primary */
  --primary-foreground: $PRIMARY_CONTENT;       /* primary-content */

  --secondary: $SECONDARY;                 /* secondary */
  --secondary-foreground: $SECONDARY_CONTENT;      /* secondary-content */

  --muted: $BASE_200;                    /* base-200 */
  --muted-foreground: $BASE_CONTENT;         /* base-content */

  --accent: $ACCENT;                    /* accent */
  --accent-foreground: $ACCENT_CONTENT;        /* accent-content */

  --destructive: $ERROR;                /* error */
  --destructive-foreground: $ERROR_CONTENT;   /* error-content */

  --border: $BASE_300;                   /* base-300 */
  --input: $BASE_300;                    /* base-300 */
  --ring: $PRIMARY;                     /* primary */
}
EOF

echo "✅ Theme converted successfully!"
echo "   Input:  $INPUT_FILE"
echo "   Output: $OUTPUT_FILE"