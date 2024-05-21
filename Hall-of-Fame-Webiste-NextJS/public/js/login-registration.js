$(document).ready(function () {
    let category = $('#category-box')
    let subCategory = $('#sub-box')
    $('#category-box').select2().on('change', function () {
        let url = window.Laravel.apiUrl + 'subcategories-list';
        let id = $(this).val();
        let sub_cat_id = $('#filter_sub_cat_id').val();
        let selected = '';
        $.ajax({
            url: url, // if you say $(this) here it will refer to the ajax call not $('.company2')
            data: {
                id: id,
            },
            type: 'GET',
            dataType: "json",

            success: function (result) {
                $('select[name="subcategory_id"]').empty();

                $('select[name="subcategory_id"]').append(
                    '<option value="" required selected disabled>Select Subcategory </option>');
                $.each(result.data.collection, function (key, value) {
                    if (value.id == sub_cat_id) {
                        selected = 'selected';
                    } else {
                        selected = '';
                    }
                    $('select[name="subcategory_id"]').append(
                        '<option ' + selected + ' value="' + value.id + '">' + value
                            .name
                            .en + '</option>');
                });
                subCategory.select2(); //reload the list and select the first option
            }
        });
    }).trigger('change');

    $('.fa-eye-slash').click(function () {
        if ($(this).hasClass('fa-eye')) {
            $(this).removeClass('fa-eye');
            $(this).addClass('fa-eye-slash');
            $(this).parent().siblings().attr('type', 'password');
        } else {
            $(this).removeClass('fa-eye-slash');
            $(this).addClass('fa-eye');
            $(this).parent().siblings().attr('type', 'text');
        }
    });

    $('#registerForm').validate({
        ignore: '',
        rules: {
            'first_name': {
                required: true,
                name: true
            },
            'last_name': {
                required: true,
                name: true
            },
            'celebrity_name[en]': {
                required: true,
                name: true
            },
            'email': {
                required: true,
                email: true,
            },
            'phone[number]': {
                required: true,
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") == "terms_conditions") {
                $(".terms_error").html(error);
            } else if (element.attr("name") == "city_id") {
                $("#city_err").html(error);
            } else if (element.attr("name") === "image") {
                $(".image_error").html(error);
            } else if (element.attr("name") === "phone[number]") {
                $(".phone_number").html(error);
            } else if (element.attr("name") === "category_id") {
                $(".category-box").html(error);
            } else if (element.attr("name") === "subcategory_id") {
                $(".subcategory-box").html(error);
            } else if (element.attr("name") === "address") {
                $(".address_error").html(error);
            } else {
                error.insertAfter(element);
            }
        },
        messages: {
            'first_name': {
                required: "First name is required",
            },
            'last_name': {
                required: "Last name is required",
            },
            'celebrity_name[en]': {
                required: "Full name is required",
            },
        }
    });
    $.validator.addMethod("name", function (value, element) {
        return this.optional(element) || value === "NA" ||
            value.match(/\S/);
    }, "Please enter a valid name");

});
