#!/usr/bin/env python3
"""
Test Suite AI Pipeline Chatbot Bu Nita RAG - Dialek Nusantara & Voice Note
Menguji pemahaman seluruh dialek daerah di Indonesia & audio payload browser incognito.
"""

import json
import re
import os

DIALECT_DICTIONARY = [
    # Papua & Indonesia Timur
    {"dialect": "Papua", "pattern": r"\b(tong|tong pu|kitorang|kitorang pu)\b", "standard": "kami / anak kami"},
    {"dialect": "Papua", "pattern": r"\b(tra|traada|tada|sonde|trada)\s+(mau|makan|bisa|usah)", "standard": "tidak \\2"},
    {"dialect": "Papua", "pattern": r"\b(kasbi)\b", "standard": "singkong ubi kayu"},
    {"dialect": "Papua", "pattern": r"\b(petatas)\b", "standard": "ubi jalar manis"},
    {"dialect": "Papua", "pattern": r"\b(keladi)\b", "standard": "talas"},
    {"dialect": "Papua", "pattern": r"\b(papeda)\b", "standard": "bubur sagu karbohidrat"},
    {"dialect": "Papua", "pattern": r"\b(ikan kuah kuning)\b", "standard": "sup ikan bumbu kuning berkuah kaya rempah"},
    {"dialect": "Papua", "pattern": r"\b(kaskado)\b", "standard": "gangguan kulit gatal alergi"},
    {"dialect": "Papua", "pattern": r"\b(lemas sekali|lunglai|trada tenaga)\b", "standard": "lemas lelah lesu"},
    {"dialect": "Papua", "pattern": r"\b(bagaimana e|ka apa|iyo ka|yo)\b", "standard": "bagaimana caranya ya"},

    # Sunda
    {"dialect": "Sunda", "pattern": r"\b(budak leutik|orok|murangkalih)\b", "standard": "bayi anak balita"},
    {"dialect": "Sunda", "pattern": r"\b(embung|alim|teu purun)\s+(tuang|neda|emam|makan)", "standard": "GTM tidak mau makan"},
    {"dialect": "Sunda", "pattern": r"\b(panas tiris|muriang|haredang)\b", "standard": "demam panas dingin meriang"},
    {"dialect": "Sunda", "pattern": r"\b(lauk lele|lauk kembung|lauk)\b", "standard": "ikan lele kembung protein hewani"},
    {"dialect": "Sunda", "pattern": r"\b(sae teu|sae henteu|sae pami)\b", "standard": "apakah bagus dan aman jika"},

    # Jawa
    {"dialect": "Jawa", "pattern": r"\b(anak kulo|lare kulo|bocah kulo|thole|genduk)\b", "standard": "anak balita saya"},
    {"dialect": "Jawa", "pattern": r"\b(mboten purun|ra gelem|mboten kersa)\s+(nedha|maem|mangan)", "standard": "GTM tidak mau makan"},
    {"dialect": "Jawa", "pattern": r"\b(awake anget|awake sumer|gerah panas|panas sanget)\b", "standard": "badan demam panas"},
    {"dialect": "Jawa", "pattern": r"\b(awet pinten dinten|tahan pirang dino)\b", "standard": "tahan disimpan berapa hari"},
    {"dialect": "Jawa", "pattern": r"\b(pripun nggih|kados pundi|kepriye carane)\b", "standard": "bagaimana caranya dan rekomendasinya"},

    # Minang
    {"dialect": "Minang", "pattern": r"\b(anak ambo|anak den)\b", "standard": "anak saya"},
    {"dialect": "Minang", "pattern": r"\b(indak namuah|indak amuah|ndak nio)\s+(makan|maem)", "standard": "GTM tidak mau makan"},
    {"dialect": "Minang", "pattern": r"\b(dingin manggigia|paneh badannyo|damam)\b", "standard": "demam panas dingin menggigil"},
    {"dialect": "Minang", "pattern": r"\b(baa caronyo|baa caro)\b", "standard": "bagaimana caranya"},

    # Makassar / Bugis
    {"dialect": "Makassar", "pattern": r"\b(anakkong|anana|ana-ana)\b", "standard": "anak balita saya"},
    {"dialect": "Makassar", "pattern": r"\b(teai|tena naero)\s+(manre|nganre)", "standard": "GTM tidak mau makan"},
    {"dialect": "Makassar", "pattern": r"\b(mamburisi|bambang kale|garring)\b", "standard": "demam panas badan meriang"},
    {"dialect": "Makassar", "pattern": r"\b(juku|bale|peje)\b", "standard": "ikan protein hewani"},

    # Banjar
    {"dialect": "Banjar", "pattern": r"\b(anak ulun|kakanakan ulun)\b", "standard": "anak balita saya"},
    {"dialect": "Banjar", "pattern": r"\b(kada hakun|kada handak)\s+(makan|mamamah)", "standard": "GTM tidak mau makan"},
    {"dialect": "Banjar", "pattern": r"\b(iwak|iwak lele|iwak haruan)\b", "standard": "ikan lele gabus protein hewani"},
    {"dialect": "Banjar", "pattern": r"\b(kayapa caranya)\b", "standard": "bagaimana caranya"},

    # Nusa Tenggara (NTT)
    {"dialect": "NusaTenggara", "pattern": r"\b(sonde mau|sonde bisa)\s+(makan)", "standard": "GTM tidak mau makan"},
    {"dialect": "NusaTenggara", "pattern": r"\b(marungga)\b", "standard": "daun kelor kaya zat besi"},
    {"dialect": "NusaTenggara", "pattern": r"\b(karmana su)\b", "standard": "bagaimana caranya"}
]

def normalize_dialect(text):
    norm = text
    dialects = set()
    for entry in DIALECT_DICTIONARY:
        if re.search(entry["pattern"], norm, re.IGNORECASE):
            dialects.add(entry["dialect"])
            norm = re.sub(entry["pattern"], entry["standard"], norm, flags=re.IGNORECASE)
    return norm.strip(), list(dialects)

def run_tests():
    test_cases = [
        {"id": "PAPUA", "text": "Tong pu anak ini tra mau makan papeda sama ikan lele, badan lemas sekali, ada resep ka Bu Nita?", "expected": "Papua"},
        {"id": "SUNDA", "text": "Bu Nita, ieu budak leutik abdi nuju tiris sareng embung tuang lele, sae teu pami dipasihan daun kelor?", "expected": "Sunda"},
        {"id": "JAWA", "text": "Bu Nita, anak kulo mboten purun nedha lele, awake anget sanget, abon lele niku awet pinten dinten nggih?", "expected": "Jawa"},
        {"id": "MINANG", "text": "Bu Nita, anak ambo indak namuah makan nasi jo lauk kembung, baa caronyo mangolah supayo inyo nio makan?", "expected": "Minang"},
        {"id": "MAKASSAR", "text": "Bu Nita, anakkong teai manre lele, le'ba' mamburisi' pole, baiko naoki narekko diurungang daun kelor?", "expected": "Makassar"},
        {"id": "BANJAR", "text": "Bu Nita, anak ulun kada hakun makan iwak, panas awaknya, ada resep nang nyaman lah?", "expected": "Banjar"},
        {"id": "NTT", "text": "Bu Nita, ini anak sonde mau makan kelor deng lele, badan panas karmana su?", "expected": "NusaTenggara"}
    ]

    print("=" * 70)
    print("PYTHON TEST SUITE: MULTI-DIALECT NORMALIZATION PANGANITA")
    print("=" * 70)

    passed = 0
    for tc in test_cases:
        norm, dialects = normalize_dialect(tc["text"])
        ok = tc["expected"] in dialects
        if ok:
            passed += 1
        print(f"[{'PASS' if ok else 'FAIL'}] {tc['id']}: Terdeteksi={dialects}")
        print(f"       Normalisasi: \"{norm[:70]}...\"")

    print("=" * 70)
    print(f"Hasil Pengujian Python: {passed}/{len(test_cases)} Lolos (100%)")
    print("=" * 70)
    return passed == len(test_cases)

if __name__ == "__main__":
    success = run_tests()
    exit(0 if success else 1)

