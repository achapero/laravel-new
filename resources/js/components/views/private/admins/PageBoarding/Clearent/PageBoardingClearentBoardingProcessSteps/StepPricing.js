import React, { useEffect, useState } from "react";
import getUserData from "../../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Row,
    Select,
    Input,
    Modal,
    notification,
    Popconfirm,
    Checkbox,
    Space
} from "antd";
import serialize from "form-serialize";
import StepPricingModalCalendly from "./StepPricingModalCalendly";

const StepPricing = ({
    formData,
    inputData,
    stepsStatuses,
    setStepsStatuses,
    currentStep,
    setCurrentStep
}) => {
    let userdata = getUserData();
    const [form] = Form.useForm();
    const [showModalCalendly, setShowModalCalendly] = useState(false);

    const toggleShowModalCalendly = () => {
        setShowModalCalendly(!showModalCalendly);
    };

    useEffect(() => {
        if (currentStep == 10) {
            if (stepsStatuses[currentStep].status != "finish") {
                let _steps = [...stepsStatuses];
                _steps[currentStep] = {
                    ..._steps[currentStep],
                    status: "progress"
                };
                setStepsStatuses(_steps);
            }

            if (!pricingValidated && userdata.role == "Merchant") {
                toggleShowModalCalendly(true);

                // alert("Pricing will be set during your signing appointment");
            }
        }

        return () => {};
    }, [currentStep]);

    const [payInMonths, setPayInMonths] = useState([]);
    const [typeCodes, setTypeCodes] = useState([]);
    const [pricingTemplates, setPricingTemplates] = useState([]);
    const [pricingData, setPricingData] = useState();
    const [pricingValidated, setPricingValidated] = useState();
    const [presets, setPresets] = useState([]);
    const {
        data: dataPricingReferences,
        isLoading: isLoadingDataPricingReferences
    } = useAxiosQuery(
        "GET",
        `api/v1/clearent/pricing/references/${formData.clearent_boarding.merchantNumber}`,
        `clearent_boarding_pricing_references`,
        res => {
            if (res.success) {
                console.log("References", res);
                setPayInMonths(res.payInMonths.content);
                setTypeCodes(res.typeCodes.content);
                setPricingTemplates(res.pricingTemplates.content);
                // getMerchantPricing();
                //console.log(res.pricingTemplates.content);
            }
        }
    );

    const {
        data: dataMerchantPricing,
        isLoading: isLoadingDataMerchantPricing
    } = useAxiosQuery(
        "GET",
        `api/v1/clearent/pricing/${formData.clearent_boarding.merchantNumber}`,
        `clearent_boarding_merchant_pricing_${formData.clearent_boarding.merchantNumber}`,
        res => {
            console.log("clearent_boarding_merchant_pricing_", res);
            if (res.success) {
                if (res.data.errors) {
                } else {
                    setPricingData(res.data);
                    setPricingValidated(res.boarding.pricing_validated);

                    if (res.boarding.pricing_validated) {
                        let _steps = [...stepsStatuses];
                        _steps[10] = {
                            ..._steps[10],
                            title: <>Pricing (1/1)</>,
                            status: "finish"
                        };
                        setStepsStatuses(_steps);
                    }
                }
            }
        }
    );

    const [selectedPricingTemplate, setSelectedPricingTemplate] = useState();
    const [selectedPricingPreset, setSelectedPricingPreset] = useState();
    useEffect(() => {
        if (pricingData) {
            if (pricingTemplates.length > 0) {
                let template = pricingTemplates.find(
                    p =>
                        p.pricingPlanTemplateID ==
                        pricingData.pricingPlanTemplateID
                );
                let _selectedPricingTemplate = {
                    ...pricingData,
                    templateFees: template.templateFees,
                    templateSettings: template.templateSettings
                };
                setSelectedPricingTemplate({ ..._selectedPricingTemplate });
                console.log(
                    "_selectedPricingTemplate",
                    _selectedPricingTemplate
                );
            }
        }
        return () => {};
    }, [pricingData, pricingTemplates]);

    const {
        refetch: refetchPricingPresets,
        isFetching: isFetchingDataPricingPresets
    } = useAxiosQuery(
        "GET_MANUAL",
        `api/v1/clearent/pricing/preset/${
            selectedPricingTemplate
                ? selectedPricingTemplate.pricingPlanTemplateID
                : null
        }`,
        `clearent_boarding_merchant_pricing_preset`,
        res => {
            if (res.success) {
                console.log("presets", res);
                setPresets(res.data);
            }
        }
    );

    const handleChangeTemplate = template => {
        let _pricingTemplate = pricingTemplates.find(
            p => p.pricingPlanTemplateID == template.pricingPlanTemplateID
        );

        console.log("_pricingTemplate", _pricingTemplate);
        if (_pricingTemplate) {
            setSelectedPricingTemplate({
                ...selectedPricingTemplate,
                ..._pricingTemplate
            });
        }
    };

    useEffect(() => {
        if (selectedPricingTemplate) {
            console.log("selectedPricingTemplate", selectedPricingTemplate);
            refetchPricingPresets();
        }
        return () => {};
    }, [selectedPricingTemplate]);

    const populatePreset = preset_id => {
        let preset = presets.find(p => p.id == preset_id);

        setSelectedPricingPreset(preset.id);
        // //console.log(selectedPricingTemplate);
        if (preset) {
            console.log("preset", preset);
            let _selectedPricingTemplate = JSON.parse(preset.preset);
            setSelectedPricingTemplate({
                ...selectedPricingTemplate,
                ..._selectedPricingTemplate
            });
        }
    };

    const generateTemplateFees = templateFees => {
        // $(".tblPricingFees tbody tr").remove();
        // //console.log("render table");
        // //console.log(templateFees);
        let formGroups = [];
        templateFees.map((templateFee, key) => {
            let price_key = pricingData
                ? pricingData.pricingFees.findIndex(
                      p =>
                          p.clearentPricingFeeID ==
                          templateFee.clearentPricingFeeID
                  )
                : null;
            let clearentPricingFeeDescription =
                templateFee.clearentPricingFeeDescription;
            clearentPricingFeeDescription = clearentPricingFeeDescription.replace(
                "With Revenue Share",
                ""
            );

            let hide = false;
            if (clearentPricingFeeDescription == "Application Processing Fee") {
                hide = true;
            }
            if (clearentPricingFeeDescription == "EMF %") {
                clearentPricingFeeDescription = "Early Merchant Funding";
            }
            formGroups.push(
                <tr key={key} className={`${hide && "hide"} `}>
                    <td>
                        <input
                            name={`pricingFees[${key}][clearentPricingFeeID]`}
                            type="hidden"
                            value={templateFee.clearentPricingFeeID}
                        />

                        <Input
                            disabled={
                                userdata.role == "Merchant" && pricingValidated
                                    ? true
                                    : false
                            }
                            type="hidden"
                            name={`pricingFees[${key}][pricingFeeDescription]`}
                            required={templateFee.isRequired}
                            //disabled={!templateFee.isEditable}
                            value={templateFee.clearentPricingFeeDescription}
                        />
                        {clearentPricingFeeDescription}
                    </td>

                    <td>
                        <div style={{ lineHeight: 2.1, display: "flex" }}>
                            <Input
                                disabled={
                                    userdata.role == "Merchant" &&
                                    pricingValidated
                                        ? true
                                        : false
                                }
                                type={templateFee.isRate ? "number" : "hidden"}
                                name={`pricingFees[${key}][rate]`}
                                required={templateFee.isRequired}
                                //disabled={!templateFee.isEditable}
                                style={{ width: "100px", textAlign: "center" }}
                                step="0.01"
                                defaultValue={
                                    price_key
                                        ? pricingData.pricingFees[price_key]
                                            ? pricingData.pricingFees[price_key]
                                                  .rate == null
                                                ? ""
                                                : (
                                                      pricingData.pricingFees[
                                                          price_key
                                                      ].rate * 100
                                                  ).toFixed(2)
                                            : ""
                                        : templateFee.defaultRate == null
                                        ? templateFee.minRate
                                        : templateFee.defaultRate
                                }
                                // value={
                                //     templateFee.defaultRate == null
                                //         ? templateFee.minRate
                                //         : templateFee.defaultRate
                                // }
                                onChange={e => {
                                    handleChangeTemplateFee(
                                        e,
                                        key,
                                        "defaultRate"
                                    );
                                }}
                                // max={templateFee.maxRate}
                                // min={templateFee.minRate}
                            />
                            {templateFee.isRate ? "%" : ""}
                        </div>
                    </td>
                    <td>
                        <div style={{ lineHeight: 2.1, display: "flex" }}>
                            {templateFee.isFee ? "$" : ""}
                            <Input
                                disabled={
                                    userdata.role == "Merchant" &&
                                    pricingValidated
                                        ? true
                                        : false
                                }
                                type={templateFee.isFee ? "number" : "hidden"}
                                name={`pricingFees[${key}][fee]`}
                                required={templateFee.isRequired}
                                //disabled={!templateFee.isEditable}
                                style={{ width: "100px", textAlign: "center" }}
                                step="0.01"
                                defaultValue={
                                    price_key
                                        ? pricingData.pricingFees[price_key]
                                            ? pricingData.pricingFees[price_key]
                                                  .fee == null
                                                ? ""
                                                : pricingData.pricingFees[
                                                      price_key
                                                  ].fee == 0.1
                                                ? "0.10"
                                                : pricingData.pricingFees[
                                                      price_key
                                                  ].fee
                                            : ""
                                        : templateFee.defaultFee == null
                                        ? templateFee.minFee == 0.1
                                            ? "0.10"
                                            : templateFee.minFee
                                        : templateFee.defaultFee == 0.1
                                        ? "0.10"
                                        : templateFee.defaultFee
                                }
                                // value={
                                //     templateFee.defaultFee == null
                                //         ? templateFee.minFee == 0.1
                                //             ? "0.10"
                                //             : templateFee.minFee
                                //         : templateFee.defaultFee == 0.1
                                //         ? "0.10"
                                //         : templateFee.defaultFee
                                // }
                                onChange={e =>
                                    handleChangeTemplateFee(
                                        e,
                                        key,
                                        "defaultFee"
                                    )
                                }
                                // max={templateFee.maxFee}
                                // min={templateFee.minFee}
                            />
                        </div>
                    </td>
                    <td>
                        {templateFee.isPayInMonthRequired1 && (
                            <select
                                disabled={
                                    userdata.role == "Merchant" &&
                                    pricingValidated
                                        ? true
                                        : false
                                }
                                className="customSelectStyle"
                                name={`pricingFees[${key}][payInMonth1]`}
                                required={templateFee.isRequired}
                                style={{ width: "120px" }}
                                // value={
                                //     templateFee.selectedPayInMonth1
                                //         ? templateFee.selectedPayInMonth1
                                //         : 1
                                // }
                                defaultValue={
                                    price_key
                                        ? pricingData.pricingFees[price_key]
                                              .payInMonth1 == null
                                            ? ""
                                            : pricingData.pricingFees[price_key]
                                                  .payInMonth1
                                        : templateFee.selectedPayInMonth1
                                        ? templateFee.selectedPayInMonth1
                                        : 1
                                }
                                onChange={e =>
                                    handleChangeTemplateFee(
                                        e,
                                        key,
                                        "selectedPayInMonth1"
                                    )
                                }
                            >
                                {payInMonths.map((payInMonth, k) => {
                                    return (
                                        <option key={k} value={payInMonth.id}>
                                            {payInMonth.description}
                                        </option>
                                    );
                                })}
                            </select>
                        )}
                    </td>
                    <td>
                        {templateFee.isPayInMonthRequired2 && (
                            <select
                                disabled={
                                    userdata.role == "Merchant" &&
                                    pricingValidated
                                        ? true
                                        : false
                                }
                                className="customSelectStyle"
                                name={`pricingFees[${key}][payInMonth2]`}
                                required={templateFee.isRequired}
                                //disabled={!templateFee.isEditable}
                                style={{ width: "120px" }}
                                defaultValue={
                                    price_key
                                        ? pricingData.pricingFees[price_key]
                                              .payInMonth2 == null
                                            ? ""
                                            : pricingData.pricingFees[price_key]
                                                  .payInMonth2
                                        : templateFee.selectedPayInMonth2
                                        ? templateFee.selectedPayInMonth2
                                        : 1
                                }
                                // value={
                                //     templateFee.selectedPayInMonth2
                                //         ? templateFee.selectedPayInMonth2
                                //         : 1
                                // }
                                onChange={e =>
                                    handleChangeTemplateFee(
                                        e,
                                        key,
                                        "selectedPayInMonth2"
                                    )
                                }
                            >
                                {payInMonths.map((payInMonth, k) => {
                                    return (
                                        <option key={k} value={payInMonth.id}>
                                            {payInMonth.description}
                                        </option>
                                    );
                                })}
                            </select>
                        )}
                    </td>
                </tr>
            );
        });

        return formGroups;
    };

    const handleChangeTemplateFee = (e, key, field) => {
        let _templateFees = selectedPricingTemplate.templateFees;
        _templateFees[key] = {
            ..._templateFees[key],
            [field]: parseFloat(e.target.value)
                ? parseFloat(e.target.value)
                : e.target.value
        };

        setSelectedPricingTemplate({
            ...selectedPricingTemplate,
            templateFees: [..._templateFees]
        });
    };

    const [showModalSavePreset, setShowModalSavePreset] = useState({
        visible: false,
        preset_name: ""
    });

    const {
        mutate: mutateSavePreset,
        isLoading: isLoadingMutateSavePreset
    } = useAxiosQuery("POST", "api/v1/clearent/pricing/preset");
    const handleSavePreset = () => {
        let data = {
            template_id: selectedPricingTemplate.pricingPlanTemplateID,
            preset_name: showModalSavePreset.preset_name,
            preset: JSON.stringify(selectedPricingTemplate)
        };

        mutateSavePreset(data, {
            onSuccess: res => {
                console.log(res);
                if (res.success) {
                    notification.success({
                        message: "Preset Successfully Saved"
                    });

                    refetchPricingPresets();
                    setShowModalSavePreset({
                        visible: false,
                        preset_name: null
                    });
                    setSelectedPricingPreset(res.data.id);
                }
            }
        });
    };

    const {
        mutate: mutateDeletePreset,
        isLoading: isLoadingMutateDeletePreset
    } = useAxiosQuery("DELETE", "api/v1/clearent/pricing/preset");

    const handleDeletePreset = () => {
        let data = {
            id: selectedPricingPreset
        };
        mutateDeletePreset(data, {
            onSuccess: res => {
                console.log(res);
                if (res.success) {
                    refetchPricingPresets();
                    notification.success({
                        message: "Preset Succesfully Delete"
                    });
                    setSelectedPricingPreset(null);
                }
            }
        });
    };

    const parsePricingData = data => {
        data["pricingPlanTemplateID"] = parseInt(
            selectedPricingTemplate.pricingPlanTemplateID
        );
        data["pricingFees"].map((pricingFee, key) => {
            pricingFee.clearentPricingFeeID = parseInt(
                pricingFee.clearentPricingFeeID
            );
            if (pricingFee.rate) {
                pricingFee.rate = parseFloat(pricingFee.rate) / 100;
            }

            if (pricingFee.fee) {
                pricingFee.fee = parseFloat(pricingFee.fee);
            }

            if (pricingFee.payInMonth1) {
                pricingFee.payInMonth1 = parseInt(pricingFee.payInMonth1);
            }

            if (pricingFee.payInMonth2) {
                pricingFee.payInMonth2 = parseInt(pricingFee.payInMonth2);
            }
        });
        data["merchantNumber"] = formData.clearent_boarding.merchantNumber;
        data["templateName"] = selectedPricingTemplate.templateName;
        data["IsDailySettle"] = data["IsDailySettle"]
            ? data["IsDailySettle"] == "true"
                ? true
                : false
            : false;
        data["isAdvancedPricing"] = data["isAdvancedPricing"]
            ? data["isAdvancedPricing"] == "true"
                ? true
                : false
            : false;
        data["IsEMF"] = data["IsEMF"]
            ? data["IsEMF"] == "true"
                ? true
                : false
            : false;
        data["IncludeAssessments"] = data["IncludeAssessments"]
            ? data["IncludeAssessments"] == "true"
                ? true
                : false
            : false;

        return data;
    };

    const {
        mutate: mutateSubmitPricing,
        isLoading: isLoadingMutateSubmitPricing
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/pricing",
        `clearent_boarding_merchant_pricing_${formData.clearent_boarding.merchantNumber}`
    );

    const {
        mutate: mutateUpdatePricing,
        isLoading: isLoadingMutateUpdatePricing
    } = useAxiosQuery(
        "UPDATE",
        `api/v1/clearent/pricing/${formData.clearent_boarding.merchantNumber}`,
        `clearent_boarding_merchant_pricing_${formData.clearent_boarding.merchantNumber}`
    );

    const handleSubmitPricing = e => {
        e.preventDefault();
        let data = serialize(e.target, { hash: true });
        console.log("pricingData Raw", data);
        data = parsePricingData(data);
        data = { ...pricingData, ...data };
        console.log("pricingData", data);

        if (pricingData) {
            mutateUpdatePricing(data, {
                onSuccess: res => {
                    console.log(res);
                    if (res.data.errors) {
                        if (res.data.errors.length > 0) {
                            res.data.errors.map((error, key) => {
                                notification.error({
                                    message: error.errorMessage
                                });
                            });
                        }
                    } else {
                        // setPricingData(res.data)
                        notification.success({
                            message: "Pricing Successfully Updated!"
                        });
                    }
                }
            });
        } else {
            mutateSubmitPricing(data, {
                onSuccess: res => {
                    console.log(res);
                    if (res.data.errors) {
                        if (res.data.errors.length > 0) {
                            res.data.errors.map((error, key) => {
                                notification.error({
                                    message: error.errorMessage
                                });
                            });
                        }
                    } else {
                        // setPricingData(res.data)
                        notification.success({
                            message: "Pricing Successfully Submitted!"
                        });
                    }
                }
            });
        }
    };

    const generateTemplateSettings = _settingName => {
        let index = selectedPricingTemplate.templateSettings.findIndex(
            p => p.settingName == _settingName
        );

        return (
            <div
                className={
                    selectedPricingTemplate.templateSettings[index].isVisible
                        ? ""
                        : "hide"
                }
            >
                <Checkbox
                    disabled={
                        userdata.role == "Merchant" && pricingValidated
                            ? true
                            : false
                    }
                    value={true}
                    name={_settingName}
                    checked={
                        _settingName == "IsDailySettle"
                            ? false
                            : selectedPricingTemplate.templateSettings[index]
                                  .defaultValue
                    }
                    onChange={e => updateTemplateSetting(e, _settingName)}
                >
                    {_settingName}?
                </Checkbox>
            </div>
        );
    };

    const updateTemplateSetting = (e, _settingName) => {
        let index = selectedPricingTemplate.templateSettings.findIndex(
            p => p.settingName == _settingName
        );

        let _templateSettings = selectedPricingTemplate.templateSettings;
        _templateSettings[index] = {
            ..._templateSettings[index],
            defaultValue: e.target.checked
        };

        setSelectedPricingTemplate({
            ...selectedPricingTemplate,
            templateSettings: _templateSettings
        });
    };

    const {
        mutate: mutateDeletePricing,
        isLoading: isLoadingMutateDeletePricing
    } = useAxiosQuery(
        "DELETE",
        `api/v1/clearent/pricing`,
        `clearent_boarding_merchant_pricing_${formData.clearent_boarding.merchantNumber}`
    );
    const handleDeletePricing = () => {
        let data = { id: formData.clearent_boarding.merchantNumber };
        mutateDeletePricing(data, {
            onSuccess: res => {
                console.log(res);

                setPricingData(null);
                setSelectedPricingTemplate(null);
                setSelectedPricingPreset(null);
                setPresets([]);
            }
        });
    };

    const {
        mutate: mutateUpdatePricingValidated,
        isLoading: isLoadingMutatePricingValidated
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/updatePricingValidated",
        `clearent_boarding_merchant_pricing_${formData.clearent_boarding.merchantNumber}`
    );
    const toggleValidatePricing = () => {
        let data = {
            merchantNumber: formData.clearent_boarding.merchantNumber,
            pricing_validated: !pricingValidated
        };

        mutateUpdatePricingValidated(data, {
            onSuccess: res => {
                if (res.success) {
                    if (!pricingValidated) {
                        setCurrentStep(currentStep + 1);
                    }
                }
            }
        });
    };

    return (
        <>
            <Card
                title="Pricing"
                extra={
                    <>
                        {pricingData && userdata.role != "Merchant" && (
                            <Popconfirm
                                title="Are you sure you want to change template?"
                                okText="Yes"
                                cancelText="No"
                                onConfirm={e => handleDeletePricing()}
                            >
                                <Button
                                    loading={isLoadingMutateDeletePricing}
                                    type="primary"
                                >
                                    Change Template
                                </Button>
                            </Popconfirm>
                        )}
                    </>
                }
                loading={isLoadingDataMerchantPricing}
            >
                {(userdata.role == "Merchant" && pricingValidated) ||
                userdata.role != "Merchant" ? (
                    <>
                        <Row gutter={12}>
                            <Col xs={24} md={presets.length == 0 ? 24 : 12}>
                                Template
                                <br />
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder="Select Pricing Template"
                                    disabled={pricingData ? true : false}
                                    onChange={(value, option) => {
                                        handleChangeTemplate(option.template);
                                    }}
                                    loading={
                                        isLoadingDataPricingReferences ||
                                        isLoadingDataMerchantPricing
                                    }
                                    value={
                                        selectedPricingTemplate
                                            ? selectedPricingTemplate.pricingPlanTemplateID
                                            : null
                                    }
                                >
                                    {pricingTemplates.map((template, key) => {
                                        return (
                                            <Select.Option
                                                key={key}
                                                value={
                                                    template.pricingPlanTemplateID
                                                }
                                                template={template}
                                            >
                                                {template.templateName}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Col>
                            <Col
                                xs={presets.length == 0 ? 0 : 24}
                                md={presets.length == 0 ? 0 : 12}
                            >
                                Presets
                                <br />
                                <Select
                                    style={{ width: "100%" }}
                                    loading={isFetchingDataPricingPresets}
                                    onChange={e => populatePreset(e)}
                                    placeholder="Select Preset"
                                    disabled={pricingData ? true : false}
                                >
                                    {presets.map((preset, key) => {
                                        return (
                                            <Select.Option
                                                key={key}
                                                value={preset.id}
                                            >
                                                {preset.preset_name}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Col>
                        </Row>
                        <Divider />
                        <form onSubmit={e => handleSubmitPricing(e)}>
                            {selectedPricingTemplate &&
                                selectedPricingTemplate.templateFees.length >
                                    0 && (
                                    <>
                                        <h5>Pricing Fees</h5>
                                        <table className="table table-bordered tblPricingFees table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Description</th>
                                                    <th>Rate</th>
                                                    <th>Fee</th>
                                                    <th>Pay in Month 1</th>
                                                    <th>Pay in Month 2</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {generateTemplateFees(
                                                    selectedPricingTemplate.templateFees
                                                )}
                                            </tbody>
                                        </table>
                                        <br />
                                        {selectedPricingPreset
                                            ? userdata.role != "Merchant" && (
                                                  <Popconfirm
                                                      title="Are you sure you want to delete this preset?"
                                                      okText="Yes"
                                                      cancelText="No"
                                                      onConfirm={e =>
                                                          handleDeletePreset(e)
                                                      }
                                                  >
                                                      <Button
                                                          danger
                                                          type="primary"
                                                          loading={
                                                              isLoadingMutateDeletePreset
                                                          }
                                                      >
                                                          Delete Preset
                                                      </Button>
                                                  </Popconfirm>
                                              )
                                            : userdata.role != "Merchant" && (
                                                  <Button
                                                      type="primary"
                                                      onClick={e =>
                                                          setShowModalSavePreset(
                                                              {
                                                                  visible: true,
                                                                  preset_name:
                                                                      ""
                                                              }
                                                          )
                                                      }
                                                  >
                                                      Save Preset
                                                  </Button>
                                              )}

                                        <Divider />
                                        {selectedPricingTemplate.pricingPlanTemplateID !=
                                            0 && (
                                            <>
                                                <Row gutter={24}>
                                                    <Col xs={24} md={10}>
                                                        Pricing Type Code
                                                        <br />
                                                        <select
                                                            disabled={
                                                                userdata.role ==
                                                                    "Merchant" &&
                                                                pricingValidated
                                                                    ? true
                                                                    : false
                                                            }
                                                            style={{
                                                                width: "100%"
                                                            }}
                                                            className="customSelectStyle"
                                                            name="pricingTypeCode"
                                                            value={
                                                                selectedPricingTemplate.pricingTypeCode
                                                            }
                                                            onChange={e => {
                                                                setSelectedPricingTemplate(
                                                                    {
                                                                        ...selectedPricingTemplate,
                                                                        pricingTypeCode: e
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            {typeCodes &&
                                                                typeCodes.map(
                                                                    (
                                                                        typeCode,
                                                                        key
                                                                    ) => {
                                                                        return (
                                                                            <option
                                                                                value={
                                                                                    typeCode.displayTypeCode
                                                                                }
                                                                                key={
                                                                                    key
                                                                                }
                                                                            >
                                                                                {
                                                                                    typeCode.displayTypeCode
                                                                                }
                                                                            </option>
                                                                        );
                                                                    }
                                                                )}
                                                        </select>
                                                    </Col>
                                                    <Col>
                                                        <Row>
                                                            <Col
                                                                xs={12}
                                                                md={12}
                                                            >
                                                                <Checkbox
                                                                    disabled={
                                                                        userdata.role ==
                                                                            "Merchant" &&
                                                                        pricingValidated
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    name="isAdvancedPricing"
                                                                    value={true}
                                                                    checked={
                                                                        selectedPricingTemplate.isAdvancedPricing
                                                                    }
                                                                    onChange={e => {
                                                                        setSelectedPricingTemplate(
                                                                            {
                                                                                ...selectedPricingTemplate,
                                                                                isAdvancedPricing:
                                                                                    e
                                                                                        .target
                                                                                        .checked
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    Is Advanced
                                                                    Pricing?
                                                                </Checkbox>
                                                            </Col>
                                                            <Col
                                                                xs={12}
                                                                md={12}
                                                            >
                                                                {generateTemplateSettings(
                                                                    "IsEMF"
                                                                )}
                                                            </Col>
                                                            <Col
                                                                xs={12}
                                                                md={12}
                                                            >
                                                                {generateTemplateSettings(
                                                                    "IsDailySettle"
                                                                )}
                                                            </Col>
                                                            <Col
                                                                xs={12}
                                                                md={12}
                                                            >
                                                                {generateTemplateSettings(
                                                                    "IncludeAssessments"
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}
                                        {userdata.role != "Merchant" && (
                                            <>
                                                <Divider />
                                                <Space>
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        loading={
                                                            isLoadingMutateSubmitPricing ||
                                                            isLoadingMutateUpdatePricing
                                                        }
                                                    >
                                                        {pricingData ? (
                                                            <>Update Pricing</>
                                                        ) : (
                                                            <>Submit Pricing</>
                                                        )}
                                                    </Button>
                                                    {pricingData && (
                                                        <Button
                                                            type="primary"
                                                            htmlType="button"
                                                            loading={
                                                                isLoadingMutatePricingValidated
                                                            }
                                                            onClick={e =>
                                                                toggleValidatePricing()
                                                            }
                                                            danger={
                                                                pricingValidated
                                                            }
                                                        >
                                                            {pricingValidated ? (
                                                                <>Unvalidate</>
                                                            ) : (
                                                                <>
                                                                    Validate &
                                                                    Proceed{" "}
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </Space>
                                            </>
                                        )}
                                    </>
                                )}
                        </form>
                    </>
                ) : (
                    <></>
                )}
            </Card>

            <Modal
                visible={showModalSavePreset.visible}
                title="Preset Name"
                onOk={e => handleSavePreset()}
                okText="Save"
                confirmLoading={isLoadingMutateSavePreset}
                onCancel={e =>
                    setShowModalSavePreset({ visible: false, data: null })
                }
            >
                <Input
                    value={showModalSavePreset.name}
                    onChange={e =>
                        setShowModalSavePreset({
                            ...showModalSavePreset,
                            preset_name: e.target.value
                        })
                    }
                />
            </Modal>
            <StepPricingModalCalendly
                showModalCalendly={showModalCalendly}
                toggleShowModalCalendly={toggleShowModalCalendly}
                merchantNumber={formData.clearent_boarding.merchantNumber}
            />
        </>
    );
};

export default StepPricing;
