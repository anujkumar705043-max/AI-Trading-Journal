import os
import json
import uuid
from PIL import Image, ImageDraw, ImageFont
from google import genai
from google.genai import types

_WORKING_GEMINI_MODEL = None

def _generate_content_with_fallback(client, contents, config=None):
    global _WORKING_GEMINI_MODEL
    models_to_try = [
        "gemini-flash-latest",
        "gemini-flash-lite-latest",
        "gemini-3.5-flash"
    ]
    if _WORKING_GEMINI_MODEL and _WORKING_GEMINI_MODEL in models_to_try:
        models_to_try.remove(_WORKING_GEMINI_MODEL)
        models_to_try.insert(0, _WORKING_GEMINI_MODEL)
        
    last_error = None
    for model_name in models_to_try:
        try:
            if config:
                response = client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=config
                )
            else:
                response = client.models.generate_content(
                    model=model_name,
                    contents=contents
                )
            _WORKING_GEMINI_MODEL = model_name
            return response
        except Exception as e:
            last_error = e
            continue
            
    raise Exception(f"All models failed. Last error: {last_error}")

def analyze_chart_and_get_json(image_path: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Gemini API Key not found.")
        
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at {image_path}")
        
    with open(image_path, "rb") as f:
        img_bytes = f.read()
        
    ext = os.path.splitext(image_path)[1].lower()
    mime_type = "image/jpeg"
    if ext == ".png":
        mime_type = "image/png"
    elif ext == ".webp":
        mime_type = "image/webp"

    system_instruction = """
    You are an expert Smart Money Concepts (SMC) and Price Action technical analyst.
    I will provide you with a screenshot of a trading chart.
    Your task is to analyze the chart and return a structured JSON mapping of all key technical levels and zones.
    
    CRITICAL REQUIREMENT:
    You must return coordinates as NORMALIZED floats between 0.0 and 1.0 (where 0,0 is top-left and 1,1 is bottom-right).
    If a structure is not present, return an empty array or null for that key.
    
    JSON SCHEMA EXPECTED EXACTLY LIKE THIS:
    {
      "trendlines": [{"x1": 0.1, "y1": 0.2, "x2": 0.9, "y2": 0.8, "label": "Uptrend"}],
      "liquidity": [{"x1": 0.2, "y1": 0.1, "x2": 0.8, "y2": 0.15, "type": "buy_side"}],
      "fvg": [{"x1": 0.4, "y1": 0.5, "x2": 0.45, "y2": 0.6}],
      "order_blocks": [{"x1": 0.2, "y1": 0.8, "x2": 0.3, "y2": 0.85, "type": "bullish"}],
      "bos": [{"x1": 0.3, "y1": 0.4, "x2": 0.5, "y2": 0.4}],
      "mss": [{"x1": 0.6, "y1": 0.7, "x2": 0.8, "y2": 0.7}],
      "support": [{"y": 0.85, "label": "Daily Support"}],
      "resistance": [{"y": 0.15, "label": "4H Resistance"}],
      "entry": {"x": 0.5, "y": 0.5},
      "sl": {"y": 0.6},
      "tp": {"y": 0.3}
    }
    
    Do not wrap the JSON in markdown formatting (like ```json), just output the raw JSON object.
    Only identify obvious, high-probability setups. Do not clutter the chart.
    """

    client = genai.Client(api_key=api_key)
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_bytes(data=img_bytes, mime_type=mime_type),
                types.Part.from_text(text="Analyze this chart and return the JSON annotation data.")
            ]
        )
    ]
    
    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        temperature=0.2
    )
    
    response = _generate_content_with_fallback(client, contents, config=config)
    text = response.text.strip()
    
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()
        
    try:
        data = json.loads(text)
        return data
    except json.JSONDecodeError as e:
        print("Failed to decode JSON from Gemini:", text)
        raise ValueError("Failed to parse Gemini response as JSON.")

def draw_annotations(image_path: str, json_data: dict) -> str:
    img = Image.open(image_path).convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    w, h = img.size
    
    def nx(val): return int(max(0, min(1, float(val))) * w)
    def ny(val): return int(max(0, min(1, float(val))) * h)

    color_bullish = (34, 197, 94, 100)
    color_bearish = (239, 68, 68, 100)
    color_liquidity = (59, 130, 246, 60)
    color_fvg = (168, 85, 247, 80)
    color_line = (255, 255, 255, 200)
    
    try:
        font = ImageFont.truetype("arial.ttf", 20)
    except:
        font = ImageFont.load_default()

    for f in json_data.get("fvg", []):
        if all(k in f for k in ("x1", "y1", "x2", "y2")):
            draw.rectangle([nx(f["x1"]), ny(f["y1"]), nx(f["x2"]), ny(f["y2"])], fill=color_fvg, outline=(168, 85, 247, 255), width=2)
            draw.text((nx(f["x1"]), ny(f["y1"]) - 20), "FVG", fill=(168, 85, 247, 255), font=font)

    for ob in json_data.get("order_blocks", []):
        if all(k in ob for k in ("x1", "y1", "x2", "y2")):
            is_bull = str(ob.get("type", "")).lower() == "bullish"
            fill_col = color_bullish if is_bull else color_bearish
            out_col = (34, 197, 94, 255) if is_bull else (239, 68, 68, 255)
            draw.rectangle([nx(ob["x1"]), ny(ob["y1"]), nx(ob["x2"]), ny(ob["y2"])], fill=fill_col, outline=out_col, width=2)
            draw.text((nx(ob["x1"]), ny(ob["y1"]) - 20), "+OB" if is_bull else "-OB", fill=out_col, font=font)

    for lq in json_data.get("liquidity", []):
        if all(k in lq for k in ("x1", "y1", "x2", "y2")):
            draw.rectangle([nx(lq["x1"]), ny(lq["y1"]), nx(lq["x2"]), ny(lq["y2"])], fill=color_liquidity, outline=(59, 130, 246, 255), width=1)
            label = "BSL" if str(lq.get("type", "")).lower() == "buy_side" else "SSL"
            draw.text((nx(lq["x1"]), ny(lq["y1"]) - 20), label, fill=(59, 130, 246, 255), font=font)

    for tl in json_data.get("trendlines", []):
        if all(k in tl for k in ("x1", "y1", "x2", "y2")):
            draw.line([nx(tl["x1"]), ny(tl["y1"]), nx(tl["x2"]), ny(tl["y2"])], fill=color_line, width=2)
            if "label" in tl:
                draw.text((nx(tl["x1"]), ny(tl["y1"]) - 20), tl["label"], fill=color_line, font=font)

    for item, label in [(json_data.get("bos", []), "BOS"), (json_data.get("mss", []), "MSS")]:
        if not item: continue
        for b in item:
            if all(k in b for k in ("x1", "y1", "x2", "y2")):
                draw.line([nx(b["x1"]), ny(b["y1"]), nx(b["x2"]), ny(b["y2"])], fill=(234, 179, 8, 255), width=2)
                draw.text(((nx(b["x1"]) + nx(b["x2"]))/2, ny(b["y1"]) - 20), label, fill=(234, 179, 8, 255), font=font)

    for item, out_col in [(json_data.get("support", []), (34, 197, 94, 255)), (json_data.get("resistance", []), (239, 68, 68, 255))]:
        if not item: continue
        for sr in item:
            if "y" in sr:
                draw.line([0, ny(sr["y"]), w, ny(sr["y"])], fill=out_col, width=2)
                if "label" in sr:
                    draw.text((10, ny(sr["y"]) - 25), sr["label"], fill=out_col, font=font)

    entry = json_data.get("entry")
    if entry and "x" in entry and "y" in entry:
        ex, ey = nx(entry["x"]), ny(entry["y"])
        draw.ellipse([ex-5, ey-5, ex+5, ey+5], fill=(255, 255, 255, 255))
        draw.text((ex+10, ey-10), "Entry", fill=(255, 255, 255, 255), font=font)

    sl = json_data.get("sl")
    if sl and "y" in sl:
        sly = ny(sl["y"])
        draw.line([0, sly, w, sly], fill=(239, 68, 68, 255), width=2)
        draw.text((w - 50, sly - 25), "SL", fill=(239, 68, 68, 255), font=font)

    tp = json_data.get("tp")
    if tp and "y" in tp:
        tpy = ny(tp["y"])
        draw.line([0, tpy, w, tpy], fill=(34, 197, 94, 255), width=2)
        draw.text((w - 50, tpy - 25), "TP", fill=(34, 197, 94, 255), font=font)

    final_img = Image.alpha_composite(img, overlay)
    
    new_filename = f"annotated_{uuid.uuid4().hex}.png"
    new_filepath = os.path.join(os.path.dirname(image_path), new_filename)
    
    final_img.convert("RGB").save(new_filepath, "PNG")
    return new_filename
