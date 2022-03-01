import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    Table,
    FormGroup,
    Label,
    CustomInput,
    notification,
    message
} from "antd";
import { useLocation } from "react-router-dom";
import {
    Link,
    DirectLink,
    Element,
    Events,
    animateScroll as scroll,
    scrollSpy,
    scroller
} from "react-scroll";

import { options } from "./PageGuideOptionIcons";

import PageGuideCardContent from "./PageGuideCardContent";

import PageGuideCardTitle from "./PageGuideCardTitle";

import PageGuideIconModal from "./Modals/PageGuideIconModal";
import PageGuideEditModal from "./Modals/PageGuideEditModal";
import PageGuideSubAddModal from "./Modals/PageGuideSubAddModal";
import PageGuideSubSubAddModal from "./Modals/PageGuideSubSubAddModal";
import PageGuideSubEditModal from "./Modals/PageGuideSubEditModal";
import PageGuideModalContent from "./Modals/PageGuideModalContent";
import PageGuideModalSelectRole from "./Modals/PageGuideModalSelectRole";
import PageGuideSearchContent from "./PageGuideSearchContent";
import PageGuideSubSubEditModal from "./Modals/PageGuideSubSubEditModal";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import { duration } from "moment";
import getUserData from "../../../../providers/getUserData";

import getCheckPermission from "../../../../providers/getCheckPermission";

const PageGuide = ({ history, permission }) => {
    let userdata = getUserData();
    const [newGuideDetails, setNewGuideDetails] = useState({
        title: "",
        icon: `question-circle`
    });
    const [searchLastMenu, setSearchLastMenu] = useState([]);
    const [onSearch, setOnSearch] = useState(false);
    const [onSearchGuide, setOnSearchGuide] = useState([]);

    const [cardGuides, setCardGuides] = useState([]);
    const [cardGuidesContent, setCardGuidesContent] = useState([]);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showViewRole, setShowViewRole] = useState(false);
    const [showSelectIcons, setShowSelectIcons] = useState(false);
    const [showSubmitModalEdit, setShowSubmitModalEdit] = useState(false);
    const [childrenIsOpen, setChildrenIsOpen] = useState(true);
    const [childrenChildIsOpen, setChildrenChildIsOpen] = useState(true);
    const [idClassNameSub, setIdClassNameSub] = useState();
    const [contentIsOpen, setContentIsOpen] = useState(true);
    const [idClassName, setIdClassName] = useState();
    const [idClassNameContent, setIdClassNameContent] = useState();
    const [guideContent, setGuideContent] = useState("");
    const [guideContentTitle, setGuideContentTitle] = useState("");
    const [guideContentId, setGuideContentId] = useState("");
    const [iconGuideSelected, setIconGuideSelected] = useState("");
    const [indexIcon, setIndexIcon] = useState("nothing");
    const [contentable, setContenable] = useState({
        merchant_guide_contentable_id: 0,
        merchant_guide_contentable_type: ""
    });
    const [showLoading, setShowLoading] = useState(false);
    const [showLoadingContent, setShowLoadingContent] = useState(false);

    const [submitButtonText, setSubmitButtonText] = useState("Save");
    const [submitButtonTextDis, setSubmitButtonTextDis] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showGuideEditModal, setShowGuideEditModal] = useState(false);
    const [showGuideEditModalId, setShowGuideEditModalId] = useState(0);
    const [showGuideSubEditModal, setShowGuideSubEditModal] = useState(false);
    const [showGuideSubEditModalId, setShowGuideSubEditModalId] = useState(0);

    const grid = 2;

    const key = "updatable";

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,
        cursor: "pointer",
        // change background colour if dragging
        background: "transparent",

        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? "lightblue" : "#f7f7f7",
        padding: grid,
        cursor: "pointer",
        width: "100%"
    });

    const {
        mutate: mutateOndragEnd,
        isLoading: isLoadingOndragEnd
    } = useAxiosQuery("POST", "api/v1/guide/updateSort", "mutate_drag_end");

    const onDragEnd = result => {
        // dropped outside the list
        if (!result.destination) {
            return;
        } else {
            if (result.source.index != result.destination.index) {
                message.loading({
                    content: "Updating...",
                    key,
                    duration: 0
                });

                var arrayA = cardGuides;
                const res = arrayA;

                const [removed] = res.splice(result.source.index, 1);
                res.splice(result.destination.index, 0, removed);

                console.log("arrayA", res);

                mutateOndragEnd(
                    {
                        source: result.source.index,
                        destination: result.destination.index,
                        res: res
                    },
                    {
                        onSuccess: res => {
                            message.success({
                                content: "Updated Successfully!",
                                key
                            });
                            getGuides();
                            console.log(res);
                        },
                        onError: err => {
                            console.log(err);
                        }
                    }
                );
            }
        }
    };

    const {
        mutate: mutateOndragEndSub,
        isLoading: isLoadingOndragEndSub
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_sub/updateSort",
        "mutate_drag_end_sub"
    );

    const onDragEndSub = (result, index) => {
        if (!result.destination) {
            return;
        } else {
            if (result.source.index != result.destination.index) {
                message.loading({
                    content: "Updating...",
                    key,
                    duration: 0
                });

                var arrayA = cardGuides;
                const res = arrayA[index].merchant_guide_subs;
                const [removed] = res.splice(result.source.index, 1);
                res.splice(result.destination.index, 0, removed);

                arrayA[index].merchant_guide_subs = res;

                mutateOndragEndSub(
                    {
                        source: result.source.index,
                        destination: result.destination.index,
                        id: result.draggableId,
                        res: res
                    },
                    {
                        onSuccess: res => {
                            message.success({
                                content: "Updated Successfully!",
                                key
                            });
                            getGuides();
                        },
                        onError: err => {
                            console.log(err);
                        }
                    }
                );
            }
        }
    };

    const {
        mutate: mutateOndragEndSubSub,
        isLoading: isLoadingOndragEndSubSub
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_sub_sub/updateSort",
        "mutate_drag_end_sub"
    );

    const onDragEndSubSub = (result, index, index2) => {
        if (!result.destination) {
            return;
        } else {
            if (result.source.index != result.destination.index) {
                message.loading({
                    content: "Updating...",
                    key,
                    duration: 0
                });

                var arrayA = cardGuides;
                const res =
                    arrayA[index].merchant_guide_subs[index2]
                        .merchant_guide_sub_subs;
                const [removed] = res.splice(result.source.index, 1);
                res.splice(result.destination.index, 0, removed);

                arrayA[index].merchant_guide_subs[
                    index2
                ].merchant_guide_sub_subs = res;

                mutateOndragEndSubSub(
                    {
                        source: result.source.index,
                        destination: result.destination.index,
                        id: result.draggableId,
                        res: res
                    },
                    {
                        onSuccess: res => {
                            message.success({
                                content: "Updated Successfully!",
                                key
                            });

                            getGuides();
                        },
                        onError: err => {
                            console.log(err);
                        }
                    }
                );
            }
        }
    };

    const {
        mutate: mutateOndragEndContent,
        isLoading: isLoadingOndragEndContent
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_content/updateSort",
        "mutate_drag_end_content"
    );

    const onDragEndContent = result => {
        // //console.log(result);
        if (!result.destination) {
            return;
        } else {
            if (result.source.index != result.destination.index) {
                message.loading({
                    content: "Updating...",
                    key,
                    duration: 0
                });

                console.log(cardGuidesContent);

                var arrayA = cardGuidesContent[0];
                const res = arrayA.merhant_guide_contents;
                const [removed] = res.splice(result.source.index, 1);
                res.splice(result.destination.index, 0, removed);

                arrayA.merhant_guide_contents = res;

                mutateOndragEndContent(
                    {
                        source: result.source.index,
                        destination: result.destination.index,
                        id: result.draggableId,
                        res: res
                    },
                    {
                        onSuccess: res => {
                            console.log(res);
                            var a = cardGuidesContent[0];
                            a.merhant_guide_contents = res.data;
                            setCardGuidesContent([a]);
                            // setShowLoadingContent(false);
                            message.success({
                                content: "Updated Successfully!",
                                key
                            });
                        },
                        onError: err => {
                            console.log(err);
                        }
                    }
                );
            }
        }
    };

    const showModalAdd = (id, type) => {
        console.log("showaddmodalconent", type);
        setShowSubmitModal(!showSubmitModal);
        setContenable({
            merchant_guide_contentable_id: id,
            merchant_guide_contentable_type: type
        });
        setGuideContent("");
        setGuideContentTitle("");
        setMerchantGuideFiles([]);
    };
    const submitCloseModal = () => {
        setShowSubmitModal(false);
    };
    const editCloseModal = () => {
        setShowSubmitModalEdit(false);
    };
    const showSelectIconsModal = (index, type) => {
        setShowSelectIcons(!showSelectIcons);
        if (type == "update") {
            setIndexIcon(index);
        }
        if (type == "add") {
            setIndexIcon("nothing");
        }
    };
    useEffect(() => {
        getGuides();
        getFirstContent();
    }, []);
    const [src, setSrc] = useState("");
    const [showModalImage, setShowModalImage] = useState(false);

    const toggleModalImage = () => {
        setShowModalImage(!showModalImage);
    };
    useEffect(() => {
        $(".left-card").on("click", "img", function(e) {
            var src = $(this).attr("src");
            $(this).css("cursor", "pointer");
            setSrc(src);
            toggleModalImage();
        });
    }, [cardGuidesContent]);

    const modalImage = () => {
        alert("wew");
    };

    const {
        mutate: mutateGetFirstContent,
        isLoading: isLoadingGetFirstContent
    } = useAxiosQuery(
        "POST",
        "api/v1/getFirstContent",
        "mutate_get_first_content"
    );

    const getFirstContent = () => {
        setShowLoadingContent(true);
        mutateGetFirstContent(
            { role: userdata.role },
            {
                onSuccess: res => {
                    setCardGuidesContent(res.data);
                    setSearchLastMenu(res.data);
                    setShowLoadingContent(false);
                    console.log(res);
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const {
        data: dataGuides,
        isLoading: isLoadingDataGuidesTable,
        refetch: getGuides,
        isFetching: isFetchingDataGuidesTable
    } = useAxiosQuery("GET", `api/v1/guides`, "guides_page", res => {
        console.log("@guides", res);
        setCardGuides(res.data);
        setShowLoading(false);
    });

    // const getGuides = e => {
    //     setShowLoading(true);
    //     fetchData("GET", "guides", newGuideDetails).then(res => {
    //         setCardGuides(res.data);
    //         //console.log(res);
    //         setShowLoading(false);
    //     });
    // };

    const closeContent = id => {
        // console.log(id);
        setContentIsOpen(!contentIsOpen);
        setIdClassNameContent(id);
    };

    useEffect(() => {
        console.log(idClassNameContent);
        if (contentIsOpen) {
            $(".CardGuideContent" + idClassNameContent)
                .find(".CardGuideContents" + idClassNameContent)
                .removeClass("hide");

            $(".CardGuideContent" + idClassNameContent)
                .find(".contentIconGuide" + idClassNameContent)
                .removeClass("hide");
            $(".CardGuideContent" + idClassNameContent)
                .find(".contentIconGuideRight" + idClassNameContent)
                .addClass("hide");
        } else {
            $(".CardGuideContent" + idClassNameContent)
                .find(".CardGuideContents" + idClassNameContent)
                .addClass("hide");
            $(".CardGuideContent" + idClassNameContent)
                .find(".contentIconGuide" + idClassNameContent)
                .addClass("hide");
            $(".CardGuideContent" + idClassNameContent)
                .find(".contentIconGuideRight" + idClassNameContent)
                .removeClass("hide");
        }
    }, [contentIsOpen]);

    useEffect(() => {
        if (childrenIsOpen) {
            $(".CardGuide" + idClassName)
                .find(".cardChildren" + idClassName)
                .removeClass("hide");
            $(".CardGuide" + idClassName)
                .find(".iconGuide" + idClassName)
                .removeClass("hide");
            $(".CardGuide" + idClassName)
                .find(".iconGuideright" + idClassName)
                .addClass("hide");
        } else {
            $(".CardGuide" + idClassName)
                .find(".cardChildren" + idClassName)
                .addClass("hide");

            $(".CardGuide" + idClassName)
                .find(".iconGuide" + idClassName)
                .addClass("hide");
            $(".CardGuide" + idClassName)
                .find(".iconGuideright" + idClassName)
                .removeClass("hide");
        }
    }, [childrenIsOpen]);

    useEffect(() => {
        if (childrenChildIsOpen) {
            $(".CardGuideSub" + idClassNameSub)
                .find(".cardChildrenSub" + idClassNameSub)
                .removeClass("hide");
            $(".CardGuideSub" + idClassNameSub)
                .find(".iconGuideSub" + idClassNameSub)
                .removeClass("hide");
            $(".CardGuideSub" + idClassNameSub)
                .find(".iconGuideSubright" + idClassNameSub)
                .addClass("hide");
        } else {
            $(".CardGuideSub" + idClassNameSub)
                .find(".cardChildrenSub" + idClassNameSub)
                .addClass("hide");

            $(".CardGuideSub" + idClassNameSub)
                .find(".iconGuideSub" + idClassNameSub)
                .addClass("hide");
            $(".CardGuideSub" + idClassNameSub)
                .find(".iconGuideSubright" + idClassNameSub)
                .removeClass("hide");
        }
    }, [childrenChildIsOpen]);

    useEffect(() => {
        Events.scrollEvent.register("begin", function() {
            console.log("begin", arguments);
        });

        Events.scrollEvent.register("end", function() {
            console.log("end", arguments);
        });
    });

    const {
        mutate: mutateOnSelectGuides,
        isLoading: isLoadingOnSelectGuides
    } = useAxiosQuery(
        "POST",
        "api/v1/guides/onSelectGuides",
        "on_select_guides_table"
    );

    const onSelectGuide = (id, className, len, type, search) => {
        // console.log(id);

        if (search) {
            mutateOnSelectGuides(
                { id: id },
                {
                    onSuccess: res => {
                        setCardGuidesContent([res.data]);
                        setSearchLastMenu([res.data]);
                        setOnSearch(false);
                        setTimeout(
                            () => {
                                scroller.scrollTo(search, {
                                    duration: 800,
                                    delay: 20,
                                    smooth: "easeInOutQuart",
                                    offset: -55
                                });
                            },

                            1000
                        );
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        } else {
            mutateOnSelectGuides(
                { id: id },
                {
                    onSuccess: res => {
                        setCardGuidesContent([res.data]);
                        setSearchLastMenu([res.data]);
                        setOnSearch(false);
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        }
    };

    const onSelectGuideChevron = (e, id) => {
        e.stopPropagation();
        setChildrenIsOpen(!childrenIsOpen);
        setIdClassName(id);
        setOnSearch(false);
    };

    const {
        mutate: mutateOnSelectGuidesSub,
        isLoading: isLoadingOnSelectGuidesSub
    } = useAxiosQuery(
        "POST",
        "api/v1/guides_sub/onSelectGuidesSub",
        "on_select_guides_sub_table"
    );

    const onSelectGuideSub = (id, search, type) => {
        if (search) {
            mutateOnSelectGuidesSub(
                { id: id },
                {
                    onSuccess: res => {
                        setCardGuidesContent([res.data]);
                        setSearchLastMenu([res.data]);
                        setOnSearch(false);
                        setTimeout(
                            () => {
                                scroller.scrollTo(search, {
                                    duration: 800,
                                    delay: 20,
                                    smooth: "easeInOutQuart",
                                    offset: -55
                                });
                            },

                            1000
                        );
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        } else {
            mutateOnSelectGuidesSub(
                { id: id },
                {
                    onSuccess: res => {
                        console.log("@sub", res);
                        setCardGuidesContent([res.data]);
                        setSearchLastMenu([res.data]);
                        setOnSearch(false);
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        }
    };

    const onSelectGuideSubChevron = (e, id, search, type) => {
        e.stopPropagation();
        setChildrenChildIsOpen(!childrenChildIsOpen);
        setIdClassNameSub(id);
        setOnSearch(false);
    };

    const {
        mutate: mutateOnSelectGuidesSubSub,
        isLoading: isLoadingOnSelectGuidesSubSub
    } = useAxiosQuery(
        "POST",
        "api/v1/guides_sub_sub/onSelectGuidesSubSub",
        "on_select_guides_sub_sub_table"
    );

    const onSelectGuideSubSub = (e, id, search) => {
        e.stopPropagation();
        if (search) {
            mutateOnSelectGuidesSubSub(
                { id: id },
                {
                    onSuccess: res => {
                        setCardGuidesContent([res.data]);
                        setSearchLastMenu([res.data]);
                        setOnSearch(false);
                        setTimeout(() => {
                            scroller.scrollTo(search, {
                                duration: 800,
                                delay: 20,
                                smooth: "easeInOutQuart",
                                offset: -55
                            });
                        }, 1000);
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        } else {
            mutateOnSelectGuidesSubSub(
                { id: id },
                {
                    onSuccess: res => {
                        console.log("@subsub", res);
                        setCardGuidesContent([res.data]);
                        setSearchLastMenu([res.data]);
                        setOnSearch(false);
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        }
    };

    const {
        mutate: mutateAddNewGuide,
        isLoading: isLoadingAddNewGuide
    } = useAxiosQuery("POST", "api/v1/guides", "mutate_add_new_guide");

    const handleAddNewGuide = e => {
        mutateAddNewGuide(newGuideDetails, {
            onSuccess: res => {
                notification.success({
                    message: "Guide Title Created Successfully "
                });
                getGuides();
                setCardGuidesContent([res.merchant_guide]);
            },
            onError: err => {
                console.log(err);
                notification.error({
                    message: "Guide Title Required"
                });
            }
        });
    };

    const [showGuideSubAddModal, setShowGuideSubAddModal] = useState(false);
    const [showGuideSubAddModalId, setShowGuideSubAddModalId] = useState(0);
    const addSub = id => {
        setShowGuideSubAddModal(!showGuideSubAddModal);
        setShowGuideSubAddModalId(id);
        console.log(id);
    };

    const [showGuideSubSubAddModal, setShowGuideSubSubAddModal] = useState(
        false
    );
    const [showGuideSubSubAddModalId, setShowGuideSubSubAddModalId] = useState(
        0
    );
    const addSubSub = id => {
        setShowGuideSubSubAddModal(!showGuideSubSubAddModal);
        setShowGuideSubSubAddModalId(id);
    };

    const [showGuideSubSubEditModal, setShowGuideSubSubEditModal] = useState(
        false
    );
    const [
        showGuideSubSubEditModalId,
        setShowGuideSubSubEditModalId
    ] = useState(0);

    const editSubSub = id => {
        console.log(id);
        setShowGuideSubSubEditModal(!showGuideSubSubAddModal);
        setShowGuideSubSubEditModalId(id);
    };

    const handleEditorChange = e => {
        setGuideContent(e);
    };

    useEffect(() => {
        if (guideContent) {
            parseEditorImages(guideContent);
        }
        return () => {};
    }, [guideContent]);

    const [uploadingImage, setUploadingImage] = useState(false);

    const {
        mutate: mutateParseEditorImages,
        isLoading: isLoadingParseEditorImages
    } = useAxiosQuery(
        "POST",
        "api/v1/ticketresponses/response/upload",
        "mutate_add_parse_editor_images"
    );

    const parseEditorImages = _editor => {
        let editor = $(_editor);
        let imgs = editor.find("img");
        if (imgs.length > 0) {
            $.each(imgs, (key, img) => {
                //console.log($(img).attr("src"));
                let src = $(img).attr("src");
                if (src.indexOf("data:image") !== -1) {
                    setUploadingImage(true);
                    mutateParseEditorImages(
                        {
                            image: src
                        },
                        {
                            onSuccess: res => {
                                let _guideContent = guideContent;
                                _guideContent = _guideContent.replace(
                                    src,
                                    location.origin + "/" + res.data
                                );
                                console.log(_guideContent);
                                setUploadingImage(false);
                                setGuideContent(_guideContent);
                            },
                            onError: err => {
                                console.log(err);
                            }
                        }
                    );
                }
            });
        } else {
            // return editor.prop("outerHTML");
        }
    };
    const handleTitleChange = e => {
        setGuideContentTitle(e.target.value);
    };

    const {
        mutate: mutateSubmitGuideContent,
        isLoading: isLoadingSubmitGuideContent
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_contents",
        "mutate_submit_guide_content"
    );

    const submitGuideContent = e => {
        if (!guideContentTitle) {
            notification.error({
                message: "Guide Title Required"
            });
        }

        if (!guideContent) {
            notification.error({
                message: "Guide Content Required"
            });
        }

        if (guideContent && guideContentTitle) {
            mutateSubmitGuideContent(
                {
                    id: contentable.merchant_guide_contentable_id,
                    type: contentable.merchant_guide_contentable_type,
                    content: guideContent,
                    title: guideContentTitle
                },
                {
                    onSuccess: res => {
                        notification.success({
                            message: "Content Created Successfully "
                        });

                        setCardGuidesContent([res.data[0]]);
                        setShowSubmitModal(false);
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        }
    };

    // toast.success('🦄 Wow so easy!', {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     });
    const handleChangeIcon = e => {
        let files = e.target.files;
        getBase64(files[0], imageUrl => {
            setNewGuideDetails({ ...newGuideDetails, icon: imageUrl });
        });
    };

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    // useEffect(() => {
    //     //console.log(guideContentTitle);
    //     return () => {};
    // }, [guideContentTitle]);

    const editGuide = (id, icon) => {
        setShowGuideEditModal(!showGuideEditModal);
        setShowGuideEditModalId(id);
        setIconGuideSelected(icon);
    };

    const editGuideSub = id => {
        setShowGuideSubEditModal(!showGuideSubEditModal);
        setShowGuideSubEditModalId(id);
    };

    const {
        mutate: mutateDeleteGuide,
        isLoading: isLoadingDeleteGuide
    } = useAxiosQuery("POST", "api/v1/guide/delete", "mutate_delete_guide");

    const deleteGuide = id => {
        mutateDeleteGuide(
            {
                id: id
            },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Guide Title Deleted Successfully"
                    });
                    getGuides();
                    setCardGuidesContent([]);
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const {
        mutate: mutateDeleteGuideSub,
        isLoading: isLoadingDeleteGuideSub
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_sub/delete",
        "mutate_delete_guide_sub"
    );

    const deleteGuideSub = id => {
        mutateDeleteGuideSub(
            {
                id: id
            },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Sub Guide Title Deleted Successfully"
                    });
                    getGuides();
                    setCardGuidesContent([]);
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const {
        mutate: mutateDeleteGuideSubSub,
        isLoading: isLoadingDeleteGuideSubSub
    } = useAxiosQuery(
        "DELETE",
        "api/v1/guide_sub_subs",
        "mutate_delete_guide_sub_sub"
    );

    const deleteGuideSubSub = id => {
        mutateDeleteGuideSubSub(
            {
                id: id
            },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Sub-Sub Guide Title Deleted Successfully"
                    });
                    getGuides();
                    setCardGuidesContent([]);
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const { mutate: mutateSearch, isLoading: isLoadingSearch } = useAxiosQuery(
        "POST",
        "api/v1/guide/filter_admin",
        "mutate_search"
    );

    const search = e => {
        if (e.target.value.length >= 3) {
            setSearchText(e.target.value);
            mutateSearch(
                {
                    search: e.target.value
                },
                {
                    onSuccess: res => {
                        console.log("@search", res);
                        setOnSearch(true);
                        setOnSearchGuide(res.data);
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        } else {
            setOnSearch(false);
            setCardGuidesContent([searchLastMenu[0]]);
        }
    };

    const {
        mutate: mutateSubmitGuideContentEdit,
        isLoading: isLoadingSubmitGuideContentEdit
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_contents/edit",
        "mutate_submit_guide_content_edit"
    );

    const submitGuideContentEdit = e => {
        console.log(guideContent);
        if (!guideContentTitle) {
            notification.error({
                message: "Guide Title Required"
            });
        }

        if (guideContent == "<p><br></p>") {
            notification.error({
                message: "Guide Content Required"
            });
        }

        if (guideContent != "<p><br></p>" && guideContentTitle) {
            mutateSubmitGuideContentEdit(
                {
                    id: guideContentId,
                    content: guideContent,
                    title: guideContentTitle
                },
                {
                    onSuccess: res => {
                        notification.success({
                            message: "Content Updated Successfully "
                        });
                        setCardGuidesContent([res.data[0]]);
                        setShowSubmitModalEdit(false);
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        }
    };

    const editContent = (id, title, content) => {
        setShowSubmitModalEdit(!showSubmitModalEdit);
        setGuideContentTitle(title);
        setGuideContentId(id);
        setGuideContent(content);
        getMerchantGuideFiles(id);
    };

    const {
        mutate: mutateDeleteContent,
        isLoading: isLoadingDeleteContent
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_contents/delete",
        "mutate_delete_content"
    );

    const deleteContent = (id, guide_id, type) => {
        mutateDeleteContent(
            {
                id: id,
                guide_id: guide_id,
                type: type
            },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Content Deleted Successfully "
                    });
                    setCardGuidesContent([res.data[0]]);
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const {
        mutate: mutateSelectIcons,
        isLoading: isLoadingSelectIcon
    } = useAxiosQuery("POST", "api/v1/guide/edit", "mutate_select_icons");

    const selectIcons = val => {
        console.log(indexIcon);
        if (indexIcon != "nothing") {
            //console.log(indexIcon);
            mutateSelectIcons(
                {
                    id: cardGuides[indexIcon]["id"],
                    title: cardGuides[indexIcon]["title"],
                    icon: val
                },
                {
                    onSuccess: res => {
                        getGuides();
                        setCardGuidesContent([res.data[0]]);
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        } else {
            setNewGuideDetails({ ...newGuideDetails, icon: val });
            setIconGuideSelected(val);
        }

        showSelectIconsModal(false);
    };

    const [selectedRole, setSelectedRole] = useState("All");
    const [selectedTitle, setSelectedTitle] = useState(0);
    const [submitButtonTextRole, setSubmitButtonTextRole] = useState("Save");

    const showViewRoleModal = (id, role) => {
        setSelectedTitle(id);
        setSelectedRole(role);
        console.log(role);
        setShowViewRole(!showViewRole);
    };

    const {
        mutate: mutateSubmitVisibleBy,
        isLoading: isLoadingSubmitVisibleBy
    } = useAxiosQuery("POST", "api/v1/guide/editRole", "submit_visible_table");

    const submitVisibleBy = e => {
        // setSubmitButtonTextRole(loadingIcon);
        mutateSubmitVisibleBy(
            {
                id: selectedTitle,
                role: selectedRole
            },
            {
                onSuccess: res => {
                    setSubmitButtonTextRole("Save");
                    setShowViewRole(false);
                    getGuides();
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const updateField = e => {
        setSelectedRole(e);
    };

    const [merchantGuideFiles, setMerchantGuideFiles] = useState([]);

    const {
        mutate: mutateMerchantGuideFiles,
        isLoading: isLoadingMerchantGuideFiles
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_files/getMerchantGuideFiles",
        "merchant_guide_files"
    );

    const getMerchantGuideFiles = id => {
        mutateMerchantGuideFiles(
            {
                id: id
            },
            {
                onSuccess: res => {
                    setMerchantGuideFiles(res.data);
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const {
        mutate: mutateGuideContentsEdit,
        isLoading: isLoadingGuideContentsEdit
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_contents/edit",
        "merchant_guide_content_edit"
    );

    let intervalID;
    useEffect(() => {
        if (showSubmitModalEdit) {
            intervalID = setInterval(() => {
                // setSubmitButtonText(loadingIcon);
                setSubmitButtonTextDis(true);
                mutateGuideContentsEdit(
                    {
                        id: guideContentId,
                        content: guideContent,
                        title: guideContentTitle
                    },
                    {
                        onSuccess: res => {
                            setCardGuidesContent([res.data[0]]);
                            setShowSubmitModalEdit(false);
                            setSubmitButtonText("Save");
                            setSubmitButtonTextDis(false);
                        },
                        onError: err => {
                            console.log(err);
                        }
                    }
                );
            }, 14 * 60 * 1000);
        }
        return () => clearInterval(intervalID);
    }, [showSubmitModalEdit, guideContentTitle, guideContent]);

    useEffect(() => {
        setTimeout(() => getCheckPermission(permission), 500);
    }, [])

    return (
        <div className="app">
            {/* <div onClick={() => ScrollTo()}>click me</div> */}
            <div
                style={{ marginTop: "30px", marginLeft: "10px" }}
                className="pageguidecardtitle"
            >
                <Row>
                    <Col xs={24} md={10}>
                        <PageGuideCardTitle
                            getListStyle={getListStyle}
                            onSelectGuide={onSelectGuide}
                            getItemStyle={getItemStyle}
                            onSelectGuideSub={onSelectGuideSub}
                            search={search}
                            handleAddNewGuide={handleAddNewGuide}
                            iconGuideSelected={iconGuideSelected}
                            showSelectIconsModal={showSelectIconsModal}
                            newGuideDetails={newGuideDetails}
                            setNewGuideDetails={setNewGuideDetails}
                            onDragEnd={onDragEnd}
                            cardGuides={cardGuides}
                            showViewRoleModal={showViewRoleModal}
                            editGuideSub={editGuideSub}
                            editGuide={editGuide}
                            deleteGuide={deleteGuide}
                            onDragEndSub={onDragEndSub}
                            deleteGuideSub={deleteGuideSub}
                            showLoading={showLoading}
                            isLoadingAddNewGuide={isLoadingAddNewGuide}
                            isLoadingDeleteGuide={isLoadingDeleteGuide}
                            isLoadingDeleteGuideSub={isLoadingDeleteGuideSub}
                            addSub={addSub}
                            addSubSub={addSubSub}
                            editSubSub={editSubSub}
                            deleteGuideSubSub={deleteGuideSubSub}
                            onSelectGuideSubSub={onSelectGuideSubSub}
                            onSelectGuideSubChevron={onSelectGuideSubChevron}
                            onSelectGuideChevron={onSelectGuideChevron}
                            onDragEndSubSub={onDragEndSubSub}
                        />
                    </Col>

                    {onSearch == true && (
                        <Col xs={24} md={13} className="left-card">
                            <PageGuideSearchContent
                                onSearchGuide={onSearchGuide}
                                onSelectGuide={onSelectGuide}
                                onSelectGuideSub={onSelectGuideSub}
                                closeContent={closeContent}
                                searchText={searchText}
                                onSelectGuideSubSub={onSelectGuideSubSub}
                                //dri sugod
                            />
                        </Col>
                    )}
                    {onSearch == false && (
                        <Col xs={24} md={13} className="left-card">
                            <PageGuideCardContent
                                cardGuidesContent={cardGuidesContent}
                                onDragEndContent={onDragEndContent}
                                getListStyle={getListStyle}
                                editContent={editContent}
                                deleteContent={deleteContent}
                                showModalAdd={showModalAdd}
                                showLoadingContent={showLoadingContent}
                                getItemStyle={getItemStyle}
                                onSelectGuide={onSelectGuide}
                                onSelectGuideSub={onSelectGuideSub}
                                closeContent={closeContent}
                            />
                        </Col>
                    )}
                </Row>

                <Row>
                    <Col>
                        <PageGuideIconModal
                            showSelectIcons={showSelectIcons}
                            setShowSelectIcons={setShowSelectIcons}
                            showSelectIconsModal={showSelectIconsModal}
                            options={options}
                            selectIcons={selectIcons}
                        />
                        <PageGuideEditModal
                            showGuideEditModal={showGuideEditModal}
                            setShowGuideEditModal={setShowGuideEditModal}
                            showGuideEditModalId={showGuideEditModalId}
                            setCardGuidesContent={setCardGuidesContent}
                            getGuides={getGuides}
                            iconGuideSelected={iconGuideSelected}
                        />

                        <PageGuideSubAddModal
                            showGuideSubAddModal={showGuideSubAddModal}
                            setShowGuideSubAddModal={setShowGuideSubAddModal}
                            showGuideSubAddModalId={showGuideSubAddModalId}
                            setCardGuidesContent={setCardGuidesContent}
                            getGuides={getGuides}
                            setIdClassName={setIdClassName}
                            setChildrenIsOpen={setChildrenIsOpen}
                        />
                        <PageGuideSubEditModal
                            showGuideSubEditModal={showGuideSubEditModal}
                            setShowGuideSubEditModal={setShowGuideSubEditModal}
                            showGuideSubEditModalId={showGuideSubEditModalId}
                            setCardGuidesContent={setCardGuidesContent}
                            getGuides={getGuides}
                        />

                        <PageGuideSubSubAddModal
                            showGuideSubSubAddModal={showGuideSubSubAddModal}
                            setShowGuideSubSubAddModal={
                                setShowGuideSubSubAddModal
                            }
                            showGuideSubSubAddModalId={
                                showGuideSubSubAddModalId
                            }
                            setCardGuidesContent={setCardGuidesContent}
                            getGuides={getGuides}
                            setIdClassNameSub={setIdClassNameSub}
                            setChildrenChildIsOpen={setChildrenChildIsOpen}
                        />

                        <PageGuideSubSubEditModal
                            showGuideSubSubEditModal={showGuideSubSubEditModal}
                            setShowGuideSubSubEditModal={
                                setShowGuideSubSubEditModal
                            }
                            showGuideSubSubEditModalId={
                                showGuideSubSubEditModalId
                            }
                            setCardGuidesContent={setCardGuidesContent}
                            getGuides={getGuides}
                        />

                        <PageGuideModalContent
                            showSubmitModal={showSubmitModal}
                            setShowSubmitModa={setShowSubmitModal}
                            showModalAdd={showModalAdd}
                            submitGuideContent={submitGuideContent}
                            handleTitleChange={handleTitleChange}
                            handleEditorChange={handleEditorChange}
                            submitButtonTextDis={submitButtonTextDis}
                            submitButtonText={submitButtonText}
                            submitCloseModal={submitCloseModal}
                            showSubmitModalEdit={showSubmitModalEdit}
                            editContent={editContent}
                            submitGuideContentEdit={submitGuideContentEdit}
                            merchantGuideFiles={merchantGuideFiles}
                            guideContentId={guideContentId}
                            getMerchantGuideFiles={getMerchantGuideFiles}
                            editCloseModal={editCloseModal}
                            uploadingImage={uploadingImage}
                            guideContentTitle={guideContentTitle}
                            guideContent={guideContent}
                            contentable={contentable}
                            isLoadingSubmitGuideContent={
                                isLoadingSubmitGuideContent
                            }
                            isLoadingSubmitGuideContentEdit={
                                isLoadingSubmitGuideContentEdit
                            }
                        />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <PageGuideModalSelectRole
                            showViewRole={showViewRole}
                            showViewRoleModal={showViewRoleModal}
                            submitVisibleBy={submitVisibleBy}
                            submitButtonTextRole={submitButtonTextRole}
                            updateField={updateField}
                            selectedRole={selectedRole}
                            setShowViewRole={setShowViewRole}
                            isLoadingSubmitVisibleBy={isLoadingSubmitVisibleBy}
                        />
                    </Col>
                </Row>
                <Row>
                    {/* <Col>
                        <Modal
                            isOpen={showModalImage}
                            toggle={toggleModalImage}
                            className="modal-lg"
                            centered
                            animation={false}
                        >
                            <img src={src} />
                        </Modal>
                    </Col> */}
                </Row>
            </div>
        </div>
    );
};

export default PageGuide;
