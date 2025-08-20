from django.utils.html import format_html


class DeleteActionMixin:
    def delete(self, obj):
        return format_html(
            '<a class="btn btn-danger" href="/admin/project/document/{}/delete/">Delete</a>',
            obj.id,
        )

    delete.short_description = "Actions"
