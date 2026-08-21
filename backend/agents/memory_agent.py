from datetime import datetime

conversation_history = []


def add_message(sender, message):
    """
    Store one conversation message.
    """

    conversation_history.append({
        "sender": sender,
        "message": message,
        "timestamp": datetime.now().strftime("%H:%M:%S")
    })


def get_conversation():
    """
    Return complete conversation history.
    """

    return conversation_history


def get_last_message(sender=None):
    """
    Return last message.
    Optionally filter by sender.
    """

    if not conversation_history:
        return None

    if sender is None:
        return conversation_history[-1]

    for msg in reversed(conversation_history):
        if msg["sender"] == sender:
            return msg

    return None


def get_conversation_text():
    """
    Return formatted conversation for LLM prompts.
    """

    if not conversation_history:
        return "No conversation history."

    conversation = ""

    for item in conversation_history:

        conversation += (
            f"{item['sender'].capitalize()}: "
            f"{item['message']}\n"
        )

    return conversation.strip()


def conversation_length():
    """
    Number of messages stored.
    """

    return len(conversation_history)


def clear_conversation():
    """
    Start a fresh session.
    """

    conversation_history.clear()