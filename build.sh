#!/bin/bash
# Build script to prepare project files for deployment
# Note: This script is not used by GitHub Actions workflow
# The workflow has its own build steps
#
# This script creates an output directory in the parent folder and copies
# only necessary project files (excluding node_modules, dist, .git, etc.)
# It does NOT copy the output directory back into the project to avoid nesting.

set -e  # Exit on error

# Get the script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="$(basename "$SCRIPT_DIR")"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

# Change to parent directory
cd "$PARENT_DIR"

# Remove existing output directory if it exists (prevents accumulation)
rm -rf output
mkdir output

# Change back to project directory
cd "$PROJECT_NAME"

# Copy project files, excluding unnecessary directories
# Note: This explicitly excludes output to prevent any circular copying
find . -maxdepth 1 \
  -not -path "." \
  -not -path "./output" \
  -not -path "./.git" \
  -not -path "./.github" \
  -not -path "./node_modules" \
  -not -path "./dist" \
  -exec cp -R {} ../output/ \;

echo "Build preparation complete. Output directory created at: $PARENT_DIR/output"
echo "Note: The output directory is NOT copied back into the project."

