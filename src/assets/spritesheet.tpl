{
    "meta": {
        "app": "Scuti Extractor",
        "format": "RGBA8888",
        "image": "<%= layout.name %>.png",
        "scale": "1.0",
        "size": {
            "w": <%= layout.width %>,
            "h": <%= layout.height %>
        },
        "version": "1.0"
    },
    "frames": {
        <% layout.images.forEach(function (image, idx) {
            if (image.className.indexOf('-') >= 0) { %>'<%= image.className %>'<% } else { %>"<%= image.className %>"<% } %>: {
                "frame": {
                    "x": <%= image.x %>,
                    "y": <%= image.y %>,
                    "w": <%= image.width %>,
                    "h": <%= image.height %>
                },
                "sourceSize": {
                    "w": <%= image.width %>,
                    "h": <%= image.height %>
                },
                "spriteSourceSize": {
                    "x": 0,
                    "y": 0,
                    "w": <%= image.width %>,
                    "h": <%= image.height %>
                },
                "rotated": false,
                "trimmed": true
                }<% if (idx !== layout.images.length - 1) { %>,<% } %>
        <% }); %>
    }
}