def find_and_remove_object_by_uuid(array, target_uuid):
    # Step 1: Find the index of the object with the matching UUID
    try:
        idx = next(i for i, obj in enumerate(array) if obj['uuid'] == target_uuid)
    except StopIteration:
        # If no object is found, return None and the original array
        return None, array
    # Step 2: Remove the object from the array
    removed_object = array.pop(idx)

    # Step 3: Return the removed object and the updated array
    return removed_object, array

# Example usage:
array_of_objects = [
    {'uuid': '123e4567-e89b-12d3-a456-426614174000', 'name': 'Object 1'},
    {'uuid': 'a8098c1a-f86e-11da-bd1a-00112444be1e', 'name': 'Object 2'},
    {'uuid': '16fd2706-8baf-433b-82eb-8c7fada847da', 'name': 'Object 3'}
]

target_uuid = '123e4567-e89b-12d3-a456-426614174000'
result, updated_array = find_and_remove_object_by_uuid(array_of_objects, target_uuid)
print(f"Removed object: {result}")
print(f"Updated array: {updated_array}")