from bookings.models import Booking
from items.models import BookedItem, Item

def populate_template(template, booking_pk):
    try:
        booking = Booking.objects.get(pk=booking_pk)
    except Booking.DoesNotExist:
        return template
    
    template = template.replace("[START DATE]", booking.loan_start_time.strftime("%d/%m/%Y"))
    template = template.replace("[END DATE]", booking.loan_end_time.strftime("%d/%m/%Y"))
    template = template.replace("[NAME]", booking.name)
    template = template.replace("[DEPOSIT]", str(booking.deposit_left))

    item_list_str = ""
    booked_items = BookedItem.objects.all().filter(booking_source=booking_pk)

    for booked_item in booked_items:
        item = booked_item.item
        item_list_str += "<li>{} {}(s)</li>".format(booked_item.quantity, item.name)
    
    item_list_str = "<ul>" + item_list_str + "</ul>"
    template = template.replace("[ITEM LIST]", item_list_str)

    return template

    