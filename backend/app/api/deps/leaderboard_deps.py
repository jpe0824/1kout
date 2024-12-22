import uuid

def generate_unique_code():
    random_uuid = uuid.uuid4()
    # Convert the UUID to a string representation
    uuid_str = str(random_uuid)
    # Remove hyphens and convert to uppercase
    clean_uuid = uuid_str.replace('-', '').upper()
    # Take the first 8 characters (assuming 8-character codes are desired)
    referral_code = clean_uuid[:8]

    return referral_code