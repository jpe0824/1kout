import uuid
from app.models.user_model import User

def generate_unique_code():
    random_uuid = uuid.uuid4()
    # Convert the UUID to a string representation
    uuid_str = str(random_uuid)
    # Remove hyphens and convert to uppercase
    clean_uuid = uuid_str.replace('-', '').upper()
    # Take the first 8 characters (assuming 8-character codes are desired)
    referral_code = clean_uuid[:8]

    return referral_code

def remove_user_from_array(arr: list[User], target: str):
    # Find the index of the object with the matching UUID
    try:
        idx = next(i for i, obj in enumerate(arr) if obj.uuid == target)
    except StopIteration:
        # If no object is found, return None and the original array
        return None, arr

    #Remove the object from the array
    removed_object = arr.pop(idx)

    # Return the removed object and the updated array
    return removed_object, arr