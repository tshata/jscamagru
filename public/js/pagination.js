
$('#pagination').pagination({
    dataSource: [1, 2, 3, 4, 5, 6, 7, ... , 100],
    pageSize: 5,
    showPrevious: false,
    showNext: false,
    callback: function(image, pagination) {
        // template method of yourself
        var html = template(data);
        dataContainer.html(html);
    }
})