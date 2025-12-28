
import pytest
import sys
import os

# Add the app directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.data.hs_cn_mapping import get_cn_code

def test_get_cn_code_known():
    """Test that get_cn_code returns the correct CN code for a known HS code."""
    assert get_cn_code("72081000") == "72081000"

def test_get_cn_code_unknown():
    """Test that get_cn_code returns None for an unknown HS code."""
    assert get_cn_code("00000000") is None

def test_get_cn_code_empty():
    """Test that get_cn_code returns None for an empty HS code."""
    assert get_cn_code("") is None
