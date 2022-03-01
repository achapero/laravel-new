import React, { useState, useEffect } from "react";
export const options = [
    {
        value: "align-left",
        label: <span className="fa fa-align-left"></span>
    },
    {
        value: "align-right",
        label: <span className="fa fa-align-right"></span>
    },

    {
        value: "ambulance",
        label: <span className="fa fa-ambulance"></span>
    },
    {
        value: "anchor",
        label: <span className="fa fa-anchor"></span>
    },

    {
        value: "angle-double-down",
        label: <span className="fa fa-angle-double-down"></span>
    },
    {
        value: "angle-double-left",
        label: <span className="fa fa-angle-double-left"></span>
    },
    {
        value: "angle-double-right",
        label: <span className="fa fa-angle-double-right"></span>
    },
    {
        value: "angle-double-up",
        label: <span className="fa fa-angle-double-up"></span>
    },
    {
        value: "angle-left",
        label: <span className="fa fa-angle-left"></span>
    },
    {
        value: "angle-right",
        label: <span className="fa fa-angle-right"></span>
    },
    {
        value: "angle-up",
        label: <span className="fa fa-angle-up"></span>
    },

    {
        value: "archive",
        label: <span className="fa fa-archive"></span>
    },
    {
        value: "area-chart",
        label: <span className="fa fa-area-chart"></span>
    },
    {
        value: "arrow-circle-down",
        label: <span className="fa fa-arrow-circle-down"></span>
    },
    {
        value: "arrow-circle-left",
        label: <span className="fa fa-arrow-circle-left"></span>
    },

    {
        value: "arrow-circle-right",
        label: <span className="fa fa-arrow-circle-right"></span>
    },
    {
        value: "arrow-circle-up",
        label: <span className="fa fa-arrow-circle-up"></span>
    },
    {
        value: "arrow-down",
        label: <span className="fa fa-arrow-down"></span>
    },
    {
        value: "arrow-left",
        label: <span className="fa fa-arrow-left"></span>
    },
    {
        value: "arrow-right",
        label: <span className="fa fa-arrow-right"></span>
    },
    {
        value: "arrow-up",
        label: <span className="fa fa-arrow-up"></span>
    },

    {
        value: "asterisk",
        label: <span className="fa fa-asterisk"></span>
    },
    {
        value: "at",
        label: <span className="fa fa-at"></span>
    },
    {
        value: "automobile",
        label: <span className="fa fa-automobile"></span>
    },
    {
        value: "backward",
        label: <span className="fa fa-backward"></span>
    },
    {
        value: "balance-scale",
        label: <span className="fa fa-balance-scale"></span>
    },
    {
        value: "ban",
        label: <span className="fa fa-ban"></span>
    },
    {
        value: "bank",
        label: <span className="fa fa-bank"></span>
    },
    {
        value: "bar-chart",
        label: <span className="fa fa-bar-chart"></span>
    },
    {
        value: "bar-chart-o",
        label: <span className="fa fa-bar-chart-o"></span>
    },

    {
        value: "battery-full",
        label: <span className="fa fa-battery-full"></span>
    },
    {
        value: "beer",
        label: <span className="fa fa-beer"></span>
    },

    {
        value: "bell",
        label: <span className="fa fa-bell"></span>
    },

    {
        value: "bell-slash",
        label: <span className="fa fa-bell-slash"></span>
    },

    {
        value: "bicycle",
        label: <span className="fa fa-bicycle"></span>
    },
    {
        value: "binoculars",
        label: <span className="fa fa-binoculars"></span>
    },
    {
        value: "birthday-cake",
        label: <span className="fa fa-birthday-cake"></span>
    },

    {
        value: "bold",
        label: <span className="fa fa-bold"></span>
    },
    {
        value: "bolt",
        label: <span className="fa fa-bolt"></span>
    },
    {
        value: "bomb",
        label: <span className="fa fa-bomb"></span>
    },
    {
        value: "book",
        label: <span className="fa fa-book"></span>
    },
    {
        value: "bookmark",
        label: <span className="fa fa-bookmark"></span>
    },

    {
        value: "briefcase",
        label: <span className="fa fa-briefcase"></span>
    },

    {
        value: "bug",
        label: <span className="fa fa-bug"></span>
    },
    {
        value: "building",
        label: <span className="fa fa-building"></span>
    },

    {
        value: "bullhorn",
        label: <span className="fa fa-bullhorn"></span>
    },
    {
        value: "bullseye",
        label: <span className="fa fa-bullseye"></span>
    },
    {
        value: "bus",
        label: <span className="fa fa-bus"></span>
    },
    {
        value: "cab",
        label: <span className="fa fa-cab"></span>
    },
    {
        value: "calendar",
        label: <span className="fa fa-calendar"></span>
    },
    {
        value: "camera",
        label: <span className="fa fa-camera"></span>
    },
    {
        value: "car",
        label: <span className="fa fa-car"></span>
    },
    {
        value: "caret-up",
        label: <span className="fa fa-caret-up"></span>
    },
    {
        value: "cart-plus",
        label: <span className="fa fa-cart-plus"></span>
    },
    {
        value: "cc",
        label: <span className="fa fa-cc"></span>
    },

    {
        value: "chain",
        label: <span className="fa fa-chain"></span>
    },
    {
        value: "check",
        label: <span className="fa fa-check"></span>
    },
    {
        value: "chevron-left",
        label: <span className="fa fa-chevron-left"></span>
    },
    {
        value: "chevron-right",
        label: <span className="fa fa-chevron-right"></span>
    },
    {
        value: "chevron-up",
        label: <span className="fa fa-chevron-up"></span>
    },
    {
        value: "child",
        label: <span className="fa fa-child"></span>
    },

    {
        value: "circle",
        label: <span className="fa fa-circle"></span>
    },

    {
        value: "clipboard",
        label: <span className="fa fa-clipboard"></span>
    },

    {
        value: "close",
        label: <span className="fa fa-close"></span>
    },
    {
        value: "cloud",
        label: <span className="fa fa-cloud"></span>
    },

    {
        value: "cny",
        label: <span className="fa fa-cny"></span>
    },
    {
        value: "code",
        label: <span className="fa fa-code"></span>
    },
    {
        value: "code-fork",
        label: <span className="fa fa-code-fork"></span>
    },

    {
        value: "coffee",
        label: <span className="fa fa-coffee"></span>
    },
    {
        value: "cog",
        label: <span className="fa fa-cog"></span>
    },
    {
        value: "cogs",
        label: <span className="fa fa-cogs"></span>
    },
    {
        value: "columns",
        label: <span className="fa fa-columns"></span>
    },
    {
        value: "comment",
        label: <span className="fa fa-comment"></span>
    },

    {
        value: "commenting",
        label: <span className="fa fa-commenting"></span>
    },

    {
        value: "comments",
        label: <span className="fa fa-comments"></span>
    },

    {
        value: "compass",
        label: <span className="fa fa-compass"></span>
    },
    {
        value: "compress",
        label: <span className="fa fa-compress"></span>
    },

    {
        value: "copy",
        label: <span className="fa fa-copy"></span>
    },
    {
        value: "copyright",
        label: <span className="fa fa-copyright"></span>
    },

    {
        value: "credit-card",
        label: <span className="fa fa-credit-card"></span>
    },
    {
        value: "crop",
        label: <span className="fa fa-crop"></span>
    },
    {
        value: "crosshairs",
        label: <span className="fa fa-crosshairs"></span>
    },

    {
        value: "cube",
        label: <span className="fa fa-cube"></span>
    },
    {
        value: "cubes",
        label: <span className="fa fa-cubes"></span>
    },
    {
        value: "cut",
        label: <span className="fa fa-cut"></span>
    },

    {
        value: "database",
        label: <span className="fa fa-database"></span>
    },
    {
        value: "dedent",
        label: <span className="fa fa-dedent"></span>
    },

    {
        value: "desktop",
        label: <span className="fa fa-desktop"></span>
    },

    {
        value: "dollar",
        label: <span className="fa fa-dollar"></span>
    },
    {
        value: "download",
        label: <span className="fa fa-download"></span>
    },

    {
        value: "edit",
        label: <span className="fa fa-edit"></span>
    },
    {
        value: "eject",
        label: <span className="fa fa-eject"></span>
    },
    {
        value: "ellipsis-h",
        label: <span className="fa fa-ellipsis-h"></span>
    },
    {
        value: "ellipsis-v",
        label: <span className="fa fa-ellipsis-v"></span>
    },

    {
        value: "envelope",
        label: <span className="fa fa-envelope"></span>
    },

    {
        value: "eur",
        label: <span className="fa fa-eur"></span>
    },
    {
        value: "euro",
        label: <span className="fa fa-euro"></span>
    },

    {
        value: "exclamation",
        label: <span className="fa fa-exclamation"></span>
    },
    {
        value: "exclamation-circle",
        label: <span className="fa fa-exclamation-circle"></span>
    },
    {
        value: "exclamation-triangle",
        label: <span className="fa fa-exclamation-triangle"></span>
    },
    {
        value: "expand",
        label: <span className="fa fa-expand"></span>
    },

    {
        value: "eye",
        label: <span className="fa fa-eye"></span>
    },
    {
        value: "eye-slash",
        label: <span className="fa fa-eye-slash"></span>
    },
    {
        value: "eyedropper",
        label: <span className="fa fa-eyedropper"></span>
    },

    {
        value: "fast-backward",
        label: <span className="fa fa-fast-backward"></span>
    },
    {
        value: "fast-forward",
        label: <span className="fa fa-fast-forward"></span>
    },
    {
        value: "fax",
        label: <span className="fa fa-fax"></span>
    },
    {
        value: "feed",
        label: <span className="fa fa-feed"></span>
    },
    {
        value: "female",
        label: <span className="fa fa-female"></span>
    },
    {
        value: "fighter-jet",
        label: <span className="fa fa-fighter-jet"></span>
    },
    {
        value: "file",
        label: <span className="fa fa-file"></span>
    },

    {
        value: "file-text",
        label: <span className="fa fa-file-text"></span>
    },

    {
        value: "film",
        label: <span className="fa fa-film"></span>
    },
    {
        value: "filter",
        label: <span className="fa fa-filter"></span>
    },
    {
        value: "fire",
        label: <span className="fa fa-fire"></span>
    },
    {
        value: "fire-extinguisher",
        label: <span className="fa fa-fire-extinguisher"></span>
    },

    {
        value: "flag",
        label: <span className="fa fa-flag"></span>
    },
    {
        value: "flag-checkered",
        label: <span className="fa fa-flag-checkered"></span>
    },

    {
        value: "flash",
        label: <span className="fa fa-flash"></span>
    },
    {
        value: "flask",
        label: <span className="fa fa-flask"></span>
    },

    {
        value: "folder",
        label: <span className="fa fa-folder"></span>
    },

    {
        value: "folder-open",
        label: <span className="fa fa-folder-open"></span>
    },

    {
        value: "font",
        label: <span className="fa fa-font"></span>
    },

    {
        value: "forward",
        label: <span className="fa fa-forward"></span>
    },

    {
        value: "gamepad",
        label: <span className="fa fa-gamepad"></span>
    },
    {
        value: "gavel",
        label: <span className="fa fa-gavel"></span>
    },
    {
        value: "gbp",
        label: <span className="fa fa-gbp"></span>
    },

    {
        value: "gear",
        label: <span className="fa fa-gear"></span>
    },
    {
        value: "gears",
        label: <span className="fa fa-gears"></span>
    },
    {
        value: "genderless",
        label: <span className="fa fa-genderless"></span>
    },

    {
        value: "gift",
        label: <span className="fa fa-gift"></span>
    },
    {
        value: "git",
        label: <span className="fa fa-git"></span>
    },

    {
        value: "glass",
        label: <span className="fa fa-glass"></span>
    },
    {
        value: "globe",
        label: <span className="fa fa-globe"></span>
    },

    {
        value: "graduation-cap",
        label: <span className="fa fa-graduation-cap"></span>
    },

    {
        value: "group",
        label: <span className="fa fa-group"></span>
    },
    {
        value: "h-square",
        label: <span className="fa fa-h-square"></span>
    },

    {
        value: "header",
        label: <span className="fa fa-header"></span>
    },
    {
        value: "headphones",
        label: <span className="fa fa-headphones"></span>
    },
    {
        value: "heart",
        label: <span className="fa fa-heart"></span>
    },

    {
        value: "heartbeat",
        label: <span className="fa fa-heartbeat"></span>
    },
    {
        value: "history",
        label: <span className="fa fa-history"></span>
    },
    {
        value: "home",
        label: <span className="fa fa-home"></span>
    },

    {
        value: "hotel",
        label: <span className="fa fa-hotel"></span>
    },
    {
        value: "hourglass",
        label: <span className="fa fa-hourglass"></span>
    },
    {
        value: "hourglass-1",
        label: <span className="fa fa-hourglass-1"></span>
    },
    {
        value: "hourglass-2",
        label: <span className="fa fa-hourglass-2"></span>
    },
    {
        value: "hourglass-3",
        label: <span className="fa fa-hourglass-3"></span>
    },
    {
        value: "hourglass-end",
        label: <span className="fa fa-hourglass-end"></span>
    },
    {
        value: "hourglass-half",
        label: <span className="fa fa-hourglass-half"></span>
    },

    {
        value: "hourglass-start",
        label: <span className="fa fa-hourglass-start"></span>
    },

    {
        value: "image",
        label: <span className="fa fa-image"></span>
    },
    {
        value: "inbox",
        label: <span className="fa fa-inbox"></span>
    },
    {
        value: "indent",
        label: <span className="fa fa-indent"></span>
    },
    {
        value: "industry",
        label: <span className="fa fa-industry"></span>
    },
    {
        value: "info",
        label: <span className="fa fa-info"></span>
    },
    {
        value: "info-circle",
        label: <span className="fa fa-info-circle"></span>
    },
    {
        value: "inr",
        label: <span className="fa fa-inr"></span>
    },

    {
        value: "institution",
        label: <span className="fa fa-institution"></span>
    },

    {
        value: "intersex",
        label: <span className="fa fa-intersex"></span>
    },

    {
        value: "italic",
        label: <span className="fa fa-italic"></span>
    },

    {
        value: "key",
        label: <span className="fa fa-key"></span>
    },

    {
        value: "krw",
        label: <span className="fa fa-krw"></span>
    },
    {
        value: "language",
        label: <span className="fa fa-language"></span>
    },
    {
        value: "laptop",
        label: <span className="fa fa-laptop"></span>
    },

    {
        value: "leaf",
        label: <span className="fa fa-leaf"></span>
    },

    {
        value: "legal",
        label: <span className="fa fa-legal"></span>
    },

    {
        value: "line-chart",
        label: <span className="fa fa-line-chart"></span>
    },

    {
        value: "list",
        label: <span className="fa fa-list"></span>
    },
    {
        value: "list-alt",
        label: <span className="fa fa-list-alt"></span>
    },
    {
        value: "list-ol",
        label: <span className="fa fa-list-ol"></span>
    },
    {
        value: "list-ul",
        label: <span className="fa fa-list-ul"></span>
    },
    {
        value: "location-arrow",
        label: <span className="fa fa-location-arrow"></span>
    },
    {
        value: "lock",
        label: <span className="fa fa-lock"></span>
    },

    {
        value: "magic",
        label: <span className="fa fa-magic"></span>
    },
    {
        value: "magnet",
        label: <span className="fa fa-magnet"></span>
    },

    {
        value: "mars-stroke-v",
        label: <span className="fa fa-mars-stroke-v"></span>
    },

    {
        value: "medkit",
        label: <span className="fa fa-medkit"></span>
    },

    {
        value: "mercury",
        label: <span className="fa fa-mercury"></span>
    },
    {
        value: "microphone",
        label: <span className="fa fa-microphone"></span>
    },
    {
        value: "mobile",
        label: <span className="fa fa-mobile"></span>
    },
    {
        value: "motorcycle",
        label: <span className="fa fa-motorcycle"></span>
    },
    {
        value: "mouse-pointer",
        label: <span className="fa fa-mouse-pointer"></span>
    },
    {
        value: "music",
        label: <span className="fa fa-music"></span>
    },
    {
        value: "navicon",
        label: <span className="fa fa-navicon"></span>
    },
    {
        value: "neuter",
        label: <span className="fa fa-neuter"></span>
    },

    {
        value: "paperclip",
        label: <span className="fa fa-paperclip"></span>
    },
    {
        value: "paragraph",
        label: <span className="fa fa-paragraph"></span>
    },
    {
        value: "paste",
        label: <span className="fa fa-paste"></span>
    },
    {
        value: "pause",
        label: <span className="fa fa-pause"></span>
    },
    {
        value: "paw",
        label: <span className="fa fa-paw"></span>
    },

    {
        value: "phone",
        label: <span className="fa fa-phone"></span>
    },
    {
        value: "photo",
        label: <span className="fa fa-photo"></span>
    },

    {
        value: "pie-chart",
        label: <span className="fa fa-pie-chart"></span>
    },
    {
        value: "pied-piper",
        label: <span className="fa fa-pied-piper"></span>
    },

    {
        value: "plane",
        label: <span className="fa fa-plane"></span>
    },
    {
        value: "play",
        label: <span className="fa fa-play"></span>
    },
    {
        value: "play-circle",
        label: <span className="fa fa-play-circle"></span>
    },

    {
        value: "plug",
        label: <span className="fa fa-plug"></span>
    },
    {
        value: "plus",
        label: <span className="fa fa-plus"></span>
    },
    {
        value: "plus-circle",
        label: <span className="fa fa-plus-circle"></span>
    },
    {
        value: "plus-square",
        label: <span className="fa fa-plus-square"></span>
    },

    {
        value: "power-off",
        label: <span className="fa fa-power-off"></span>
    },
    {
        value: "print",
        label: <span className="fa fa-print"></span>
    },
    {
        value: "puzzle-piece",
        label: <span className="fa fa-puzzle-piece"></span>
    },

    {
        value: "qrcode",
        label: <span className="fa fa-qrcode"></span>
    },
    {
        value: "question",
        label: <span className="fa fa-question"></span>
    },
    {
        value: "question-circle",
        label: <span className="fa fa-question-circle"></span>
    },
    {
        value: "quote-left",
        label: <span className="fa fa-quote-left"></span>
    },
    {
        value: "quote-right",
        label: <span className="fa fa-quote-right"></span>
    },

    {
        value: "recycle",
        label: <span className="fa fa-recycle"></span>
    },

    {
        value: "refresh",
        label: <span className="fa fa-refresh"></span>
    },
    {
        value: "registered",
        label: <span className="fa fa-registered"></span>
    },
    {
        value: "remove",
        label: <span className="fa fa-remove"></span>
    },

    {
        value: "reorder",
        label: <span className="fa fa-reorder"></span>
    },
    {
        value: "repeat",
        label: <span className="fa fa-repeat"></span>
    },
    {
        value: "reply",
        label: <span className="fa fa-reply"></span>
    },
    {
        value: "reply-all",
        label: <span className="fa fa-reply-all"></span>
    },

    {
        value: "road",
        label: <span className="fa fa-road"></span>
    },
    {
        value: "rocket",
        label: <span className="fa fa-rocket"></span>
    },
    {
        value: "rotate-left",
        label: <span className="fa fa-rotate-left"></span>
    },
    {
        value: "rotate-right",
        label: <span className="fa fa-rotate-right"></span>
    },
    {
        value: "rouble",
        label: <span className="fa fa-rouble"></span>
    },
    {
        value: "rss",
        label: <span className="fa fa-rss"></span>
    },
    {
        value: "rss-square",
        label: <span className="fa fa-rss-square"></span>
    },

    {
        value: "sort-asc",
        label: <span className="fa fa-sort-asc"></span>
    },
    {
        value: "sort-desc",
        label: <span className="fa fa-sort-desc"></span>
    },
    {
        value: "sort-down",
        label: <span className="fa fa-sort-down"></span>
    },
    {
        value: "spinner",
        label: <span className="fa fa-spinner"></span>
    },

    {
        value: "star",
        label: <span className="fa fa-star"></span>
    },

    {
        value: "stop",
        label: <span className="fa fa-stop"></span>
    },
    {
        value: "subscript",
        label: <span className="fa fa-subscript"></span>
    },
    {
        value: "tablet",
        label: <span className="fa fa-tablet"></span>
    },

    {
        value: "tag",
        label: <span className="fa fa-tag"></span>
    },
    {
        value: "tags",
        label: <span className="fa fa-tags"></span>
    }
];
