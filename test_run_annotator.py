from annotator import analyze_chart_and_get_json
import os

# Create a dummy image
from PIL import Image
Image.new('RGB', (100, 100), color='white').save('dummy.png')

try:
    print("Testing...")
    res = analyze_chart_and_get_json('dummy.png')
    print("Success:", res)
except Exception as e:
    import traceback
    traceback.print_exc()
