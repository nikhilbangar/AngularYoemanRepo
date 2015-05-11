"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("CreateQuestionForMobileController", ["$scope", "$log", "$routeParams", "JDPAFactory",
    function ($scope, $log, $routeParams, JDPAFactory) {
        var surveyName = $routeParams.filename;
        var questionIndex = $routeParams.questionStartIndex;
        var QuestionObject = {},
            GroupObject = {},
            questionJSONData = {};

        var flag = false;
        var questionTitle = null;
        var startQuestionKey = "";
        var question_panel_container = $(".question-panel-container"),
            questionIndexCount = 1;

        var tempObject = {
            "Survey Name": surveyName,
            "For": "MOBILE_PARTIAL"
        };

        $log.info("survey name: " + surveyName);
       
        var isPartialSurvey = false;

        function init() {

            JDPAFactory.getPartialQuestionData(tempObject,
                function (data, status) {
                    questionJSONData = data;
                    console.log("questionJSONData size: " + Object.keys(questionJSONData).length);

                    if (Object.keys(questionJSONData).length) {
                        isPartialSurvey = true;
                    } else {
                        isPartialSurvey = false;
                    }

                    if (isPartialSurvey) {
                        QuestionObject = questionJSONData.Data;
                        GroupObject = questionJSONData.Group;
                        
                        var noOfQusetionsInPartialSurvey = Object.keys(QuestionObject).length;

                        if (noOfQusetionsInPartialSurvey == 1) {
                            noOfQusetionsInPartialSurvey = noOfQusetionsInPartialSurvey + 1;
                        }
                        
                        questionIndexCount = noOfQusetionsInPartialSurvey;
                        $scope.QuestionNumber = "0";
                    } else {
                        QuestionObject = {};
                        GroupObject = {};
                        questionIndexCount = 1;
                        $scope.QuestionNumber = "1";
                    }

                },
                function (err) {

                }
            );

        }

        init();






        // event to add new question panel on add question btn click
        $(".add-question-btn").click(function () {
            var newQuestionPanel = '<div class="row"><div class="col-sm-12" style="margin-bottom:5px"><button class="btn btn-primary remove-question-btn pull-right" type="submit">Remove Question | -</button></div><!-- question panel --><div class="col-sm-8"><div class="panel panel-info panel-question panel-info-question-web"><div class="panel-heading"><div class="panel-title question-title-web "></div></div><div class="panel-body"><form class="form-horizontal"><div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label">Question Code</label><div class="col-sm-4"><input type="text" class="form-control" id="question-code"></div></div><div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label">Question</label><div class="col-sm-9"><!--<textarea id="question-textarea" class="form-control" rows="5" id="comment" style="width:100%" required></textarea>--><textarea id="question" class="form-control" rows="5" id="comment" style="width:100%" required></textarea></div></div><div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-9"><div class="btn-group"><button type="button" class="btn btn-danger">ADD Response</button><button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul class="dropdown-menu selectionType-dropdown" role="menu"><li><a role="simple-radio-or-checkbox">SimpleRadioOrCheckbox</a></li><li><a role="simple-mixed">SimpleMixed</a></li><li><a role="simple-dropdown">SimpleDropDown</a></li><li><a role="multi-dropdown">MultiDropDown</a></li><!--<li><a role="single-grid-radio-or-checkbox">SingleGridRadioOrCheckbox</a></li>--><li><a role="loyalty-grid">LoyaltyGrid</a></li><li><a role="osat-grid">OSATGrid</a></li><li><a role="standard-attribute-grid">StandardAttributeGrid</a></li></ul></div><div class="btn-group simple-mixed-btn-group hide" style="margin-left:4px;"><button type="button" class="btn btn-danger">ADD Mixed Element</button><button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul class="dropdown-menu simplemix-dropdown" role="menu"><li><a role="textbox">Textbox</a></li><li><a role="textarea">Textarea</a></li><li><a role="checkbox-or-radio">CheckboxOrRadio</a></li></ul></div></div></div><div id="selection-type" class="response-container" selectionType=""></div></form></div><!-- end of panel body --></div><!-- end of panel --></div><!-- prog panel --><div class="col-sm-4"><div class="panel panel-info panel-info-prog-web"><div class="panel-heading"><div class="panel-title">PROG</div></div><div class="panel-body" style="padding-top:0px;padding-bottom:0px;"><form class="form-horizontal form-horizontal-prog-web"><div class="checkbox"><label><input type="checkbox" name="prog-single-response" checked value="SINGLE RESPONSE"> Single Response </label></div><div class="checkbox"><label><input type="checkbox" name="prog-fixed" checked value="FIXED"> Fixed </label></div><div class="checkbox"><label><input type="checkbox" name="prog-forced" checked value="FORCED"> Forced </label></div><div class="dropdown clearfix" style="margin:10px 0px;"><button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu4" data-toggle="dropdown" aria-expanded="true"> Ask <span class="caret"></span></button><ul class="dropdown-menu ask-dropdown-menu" role="menu" aria-labelledby="dropdownMenu4"><li role="presentation"><a role="menuitem" name="response-level-ask" tabindex="-1">Response level ASK</a></li><li role="presentation"><a role="menuitem" name="ask-if" tabindex="-1">ASK IF</a></li><li role="presentation"><a role="menuitem" name="question-depend-on" tabindex="-1">Question Depend On</a></li></ul></div><div class="ask-container"></div></div></form></div></div></div>';

            question_panel_container.find(".row:last-child").after(newQuestionPanel);

        });



        // event to add new question panel on add question btn click
        question_panel_container.on("click", ".remove-question-btn", function () {
            $(this).closest(".row").remove();
        });



        // event to handle click on Add element dropdown
        question_panel_container.on("click", ".selectionType-dropdown li a", function () {
            $(this).parents(".form-horizontal").children(".response-container").empty();
            $(this).parents(".form-horizontal").children(".response-container").attr("selectionType", $(this).text());

            switch ($(this).attr("role")) {
            case "simple-radio-or-checkbox":
                simpleRadioOrCheckbox($(this));
                break;
            case "simple-mixed":
                simpleMixed($(this));
                break;
            case "single-grid-radio-or-checkbox":
                singleGridRadioOrCheckbox($(this));
                break;
            case "simple-dropdown":
                simpleDropdown($(this));
                break;
            case "multi-dropdown":
                multiDropdown($(this));
                break;
            case "loyalty-grid":
                loyaltyGrid($(this));
                break;
            case "standard-attribute-grid":
                standardAttributeGrid($(this));
                break;
            case "osat-grid":
                osatGrid($(this));
                break;
            }

        });


        /**
         *   SimpleRadioOrCheckbox
         *
         **/


        // function to render simple-radio-or-checkbox
        function simpleRadioOrCheckbox(currentSelectionType) {

            var response_level_prog = currentSelectionType.parents(".form-horizontal").parents(".col-sm-8").siblings(".col-sm-4").find("input[name='response-level-prog']");

            var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-2"><input type="text" class="form-control response-code" placeholder="Code"></div><div class="col-sm-7"><div class="input-group" style="margin-left:0px;"><textarea for="input-value-for-simple-radio-or-checkbox" class="form-control" placeholder="Response value"></textarea><span class="btn input-group-addon btn-delete-at-level1"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div><div class="response-level-ask-container hide"><div class="input-group" style="margin-bottom:5px"><span class="input-group-addon">ASK</span><input type="text" class="form-control response-ask" aria-describedby="basic-addon2"><span class="btn input-group-addon remove-ask-at-response-level"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div></div>';

            currentSelectionType.parents(".form-horizontal").children(".response-container").append(inputElement);
            currentSelectionType.parents(".btn-group").siblings(".simple-mixed-btn-group").removeClass("show").css("display", "none");

        }



        // event to delete response at level 1 for simpleRadioOrCheckbox
        question_panel_container.on("click", ".btn-delete-at-level1", function (e) {
            $(this).closest(".form-group").remove();
        });


        // event to delete response at level 1 for simpleRadioOrCheckbox
        question_panel_container.on("click", ".remove-ask-at-response-level", function (e) {
            $(this).closest(".response-level-ask-container").find(".response-ask").val("");
            $(this).closest(".response-level-ask-container").removeClass("show").addClass("hide");
        });


        // event to dynamically add column label in SimpleRadioOrCheckbox
        question_panel_container.on("keydown", ".response-container .form-group textarea[for='input-value-for-simple-radio-or-checkbox']:last", function (e) {
            if (e.which == "9") {

                var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-2"><input type="text" class="form-control response-code" placeholder="Code"></div><div class="col-sm-7"><div class="input-group" style="margin-left:0px;"><textarea for="input-value-for-simple-radio-or-checkbox" class="form-control" placeholder="Response value"></textarea><span class="btn input-group-addon btn-delete-at-level1"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div><div class="response-level-ask-container hide"><div class="input-group" style="margin-bottom:5px"><span class="input-group-addon">ASK</span><input type="text" class="form-control response-ask" aria-describedby="basic-addon2"><span class="btn input-group-addon remove-ask-at-response-level"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div></div>';

                $(this).parents(".response-container").append(inputElement);
            }
        });



        /**
         *   SimpleMixed
         *
         **/



        // function to render simple-radio-or-checkbox
        function simpleMixed(currentSelectionType) {
            currentSelectionType.parents(".btn-group").siblings(".simple-mixed-btn-group").removeClass("hide").css("display", "inline-block");
        }



        /*****  Start : written by SANJAY ***********/
        question_panel_container.on("click", ".simplemix-dropdown li a", function () {
            var element = createQuestionElement($(this).attr('role'));
            $(this).parents(".form-horizontal").children(".response-container").append(element);
        });



        function createQuestionElement(placeHolder) {
                var role = "";
                switch (placeHolder) {
                case "textbox":
                    role = "text";
                    placeHolder = "Textbox Value";

                    var elementString = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-2"><input type="text" class="form-control response-code" placeholder="Code"></div><div class="col-sm-5"><div class="input-group" style="margin-left:0px;"><textarea class="form-control for-textbox" role="' + role + '" placeholder="Input Text"></textarea><span class="btn input-group-addon btn-delete-at-level1"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div>';
                    break;
                case "textarea":
                    role = "textarea";
                    placeHolder = "Textarea Value";

                    var elementString = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-2"><input type="text" class="form-control response-code" placeholder="Code"></div><div class="col-sm-5"><div class="input-group" style="margin-left:0px;"><textarea class="form-control for-textbox" role="' + role + '" placeholder="Input Text"></textarea><span class="btn input-group-addon btn-delete-at-level1"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div>';
                    break;
                case "checkbox-or-radio":
                    role = "checkboxOrRadio";
                    placeHolder = "Checkbox or Radio button Value";

                    var elementString = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-2"><input type="text" class="form-control response-code" placeholder="Code"></div><div class="col-sm-7"><div class="input-group" style="margin-left:0px;"><textarea class="form-control for-checkbox-or-radio" placeholder="CheckboxOrRadio Label"></textarea><span class="btn input-group-addon btn-delete-at-level1"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div>';
                    break;
                }


                return elementString;
            }
            /*****  End : written by SANJAY ***********/



        /**
         *   SingleGridRadioOrCheckbox
         *
         **/



        // function to render single-grid-radio-or-checkbox
        function singleGridRadioOrCheckbox(currentSelectionType) {
            var inputElement = '<div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-9" style="overflow-x:scroll;overflow-y:scroll;"><table class="table table-striped table-for-singlegrid"><tbody><tr><td style="width:66%"><div class="row-lbl-container" style="margin-bottom:1px;"><input type="text" class="form-control response-code" placeholder="Code" style="max-width:76px;float:left;margin-right:5px;"><div class="input-group-addon" style="background: transparent;padding: 0px;border-color: transparent;"><textarea for="input-value-for-single-grid-radio-or-checkbox" class="form-control" placeholder="Row Label"></textarea></div></div></td><td><div class="column-lbl-container" style="margin-bottom:10px;"><input type="text" class="form-control" placeholder="Column Label"></div></td></tr></tbody></table></div></div>';

            currentSelectionType.parents(".form-horizontal").children(".response-container").append(inputElement);
            currentSelectionType.parents(".btn-group").siblings(".simple-mixed-btn-group").removeClass("show").css("display", "none");
        }



        // event to remove row from SingleGridRadioOrCheckbox
        question_panel_container.on("click", ".remove-row-for-single-grid-radio-or-checkbox", function () {
            $(this).closest(".row-lbl-container").remove();
        });



        // event to remove column from SingleGridRadioOrCheckbox
        question_panel_container.on("click", ".remove-column-for-single-grid-radio-or-checkbox", function () {
            $(this).closest(".column-lbl-container").remove();
        });



        // event to dynamically add row label in SingleGridRadioOrCheckbox
        question_panel_container.on("keydown", ".response-container .form-group .table-for-singlegrid td:nth-child(1) textarea:last", function (e) {
            if (e.which == "9") {
                var inputElement = '<div class="row-lbl-container" style="margin-bottom:2px;"><input type="text" class="form-control response-code" placeholder="Code" style="max-width:76px;float:left;margin-right:5px;"><div class="input-group"><textarea for="input-value-for-single-grid-radio-or-checkbox" class="form-control" placeholder="Row Label"></textarea><span class="btn input-group-addon remove-row-for-single-grid-radio-or-checkbox"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div>';

                $(this).parents("td").append(inputElement);
            }
        });



        // event to dynamically add column label in SingleGridRadioOrCheckbox
        question_panel_container.on("keydown", ".response-container .form-group .table-for-singlegrid td:nth-child(2) input:last", function (e) {
            if (e.which == "9") {
                var inputElement = '<div class="column-lbl-container" style="margin-bottom:10px;"><div class="input-group"><input type="text" class="form-control" placeholder="Column Label"><span class="btn input-group-addon remove-column-for-single-grid-radio-or-checkbox"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div>';

                $(this).parents("td").append(inputElement);
            }
        });


        /**
         *   OsatGrid
         *
         **/


        // function to render osat-grid
        function osatGrid(currentSelectionType) {
            var inputElement = '<div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-9" style="overflow-x:scroll;overflow-y:scroll;"><table class="table table-striped table-for-osatgrid"><tbody><tr><td style="width:66%"><div class="row-lbl-container" style="margin-bottom:5px;float:left;"><div class="col-sm-3"><input type="text" class="form-control response-code" placeholder="Code" style=""></div><div class="col-sm-5"><div class="input-group"><textarea for="input-value-for-osat-grid" class="form-control" placeholder="Row Label"></textarea><span class="btn input-group-addon remove-row-for-osat-grid"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div></td></tr></tbody></table></div></div>';

            currentSelectionType.parents(".form-horizontal").children(".response-container").append(inputElement);
            currentSelectionType.parents(".btn-group").siblings(".simple-mixed-btn-group").removeClass("show").css("display", "none");

        }


        // event to dynamically add row label in osat-grid
        question_panel_container.on("keydown", ".response-container .form-group .table-for-osatgrid td:nth-child(1) textarea:last", function (e) {
            if (e.which == "9") {
                var inputElement = '<div class="row-lbl-container" style="margin-bottom:5px;float:left;"><div class="col-sm-3"><input type="text" class="form-control response-code" placeholder="Code" style=""></div><div class="col-sm-5"><div class="input-group"><textarea for="input-value-for-osat-grid" class="form-control" placeholder="Row Label"></textarea><span class="btn input-group-addon remove-row-for-osat-grid"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div>';

                $(this).parents("td").append(inputElement);
            }
        });


        // event to remove row from oast-grid
        question_panel_container.on("click", ".remove-row-for-osat-grid", function () {
            $(this).closest(".row-lbl-container").remove();
        });



        /**
         *   Standard Attribute Grid
         *
         **/


        // function to render Standard Attribute Grid
        function standardAttributeGrid(currentSelectionType) {
            var inputElement = '<div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-9" style="overflow-x:scroll;overflow-y:scroll;"><table class="table table-striped table-for-standard-attribute-grid"><tbody><tr><td style="width:66%"><div class="row-lbl-container" style="margin-bottom:5px;float:left;"><div class="col-sm-3"><input type="text" class="form-control response-code" placeholder="Code" style=""></div><div class="col-sm-5"><div class="input-group"><textarea for="input-value-for-single-grid-radio-or-checkbox" class="form-control" placeholder="Row Label"></textarea><span class="btn input-group-addon remove-row-for-osat-grid"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div><div class="col-sm-4"><div class="input-group"><span class="input-group-addon"><input type="checkbox" class="exclude" checked></span><label class="form-control" aria-describedby="basic-addon2">Include N/A</label></div></div></div></td></tr></tbody></table></div></div>';

            currentSelectionType.parents(".form-horizontal").children(".response-container").append(inputElement);
            currentSelectionType.parents(".btn-group").siblings(".simple-mixed-btn-group").removeClass("show").css("display", "none");

        }


        // event to dynamically add row label in osat-grid
        question_panel_container.on("keydown", ".response-container .form-group .table-for-standard-attribute-grid td:nth-child(1) textarea:last", function (e) {
            if (e.which == "9") {
                var inputElement = '<div class="row-lbl-container" style="margin-bottom:5px;float:left;"><div class="col-sm-3"><input type="text" class="form-control response-code" placeholder="Code" style=""></div><div class="col-sm-5"><div class="input-group"><textarea for="input-value-for-single-grid-radio-or-checkbox" class="form-control" placeholder="Row Label"></textarea><span class="btn input-group-addon remove-row-for-standard-attribute-grid"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div><div class="col-sm-4"><div class="input-group"><span class="input-group-addon"><input type="checkbox" class="exclude" checked></span><label class="form-control" aria-describedby="basic-addon2">Include N/A</label></div></div></div>';

                $(this).parents("td").append(inputElement);
            }
        });


        // event to remove row from oast-grid
        question_panel_container.on("click", ".remove-row-for-standard-attribute-grid", function () {
            $(this).closest(".row-lbl-container").remove();
        });




        /**
         *   SimpleDropDown
         *
         **/



        // function to render simple-dropdown 
        function simpleDropdown(currentSelectionType) {
            var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-7"><textarea for="input-value-for-simple-dropdown" class="form-control" placeholder="Dropdown Response Value"></textarea></div></div>';

            currentSelectionType.parents(".form-horizontal").children(".response-container").append(inputElement);
            currentSelectionType.parents(".btn-group").siblings(".simple-mixed-btn-group").removeClass("show").css("display", "none");
        }



        // event to dynamically add dropdown item panel in SimpleDropDown
        question_panel_container.on("keydown", ".response-container .form-group textarea[for='input-value-for-simple-dropdown']:last", function (e) {
            if (e.which == "9") {
                var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-7"><div class="input-group" style="margin-left:0px;"><textarea for="input-value-for-simple-dropdown" class="form-control" placeholder="Dropdown Response Value"></textarea><span class="btn input-group-addon remove-sinple-dropdown-item-btn"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div>';

                $(this).parents(".response-container").append(inputElement);
            }
        });



        // event to remove dropdown item panel for SimpleDropDown
        question_panel_container.on("click", ".remove-sinple-dropdown-item-btn", function (e) {
            $(this).closest(".form-group").remove();
        });



        /**
         *   MultiDropDown
         *
         **/



        // function to render simple-dropdown
        function multiDropdown(currentSelectionType) {
            var inputElement = '<div class="multidropdown-container"><div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-4"><div class="input-group" id="noOfList"><input id="no-of-dropdowns" type="number" min="1" class="form-control" name="textbox" maxlength="2" placeholder="No. of Dropdowns" aria-describedby="basic-addon2"><span class="btn input-group-addon add-dropdown-btn">ADD </span></div></div></div><div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-9" style="overflow-x:scroll;overflow-y:scroll;"><table class="table table-striped table-for-multidropdown"><thead><tr><th><textarea placeholder="Dropdown Label" name="L1" class="form-control"></textarea></th></tr></thead><tbody><tr><td scope="row" role="L1"><textarea class="form-control" placeholder="Dropdown Item" style="margin-bottom:5px;"></textarea></td></tr></tbody></table></div></div></div>';

            currentSelectionType.parents(".form-horizontal").children(".response-container").append(inputElement);
            currentSelectionType.parents(".btn-group").siblings(".simple-mixed-btn-group").removeClass("show").css("display", "none");
        }


        // event to add dynamically dropdown item input box for MultiDropDown
        question_panel_container.on("keydown", ".response-container .table-for-multidropdown tbody textarea:last-child", function (event) {
            if (event.which == 9) {
                var addInput = '<textarea class="form-control" style="margin-bottom:5px;" placeholder="Dropdown Item">';
                $(this).parent("td").append(addInput);
            }
        });



        // event to add another dropdown dynamically in MultiDropDown
        question_panel_container.on("click", ".response-container .multidropdown-container .add-dropdown-btn", function (event) {
            var noOfDropdown = $(this).prev("input#no-of-dropdowns").val();
            if (noOfDropdown) {
                var tempNumberOfList = Number(noOfDropdown);
                var noOfColumns = $(".table-for-multidropdown thead tr th").length;
                for (var listIndex = 0; listIndex < tempNumberOfList - 1; listIndex++) {
                    noOfColumns = noOfColumns + 1;
                    var listTitle = '<th><textarea placeholder="Dropdown Label" name="L' + noOfColumns + '" class="form-control"></textarea></th>';
                    var listColumn = '<td scope="row"  role="L' + noOfColumns + '"><textarea placeholder="Dropdown Item" class="form-control" style="margin-bottom:5px;"></textarea></td>';

                    $(this).parents(".form-group").siblings(".form-group").find(".table-for-multidropdown thead tr th:last").after(listTitle);
                    $(this).parents(".form-group").siblings(".form-group").find(".table-for-multidropdown tbody tr td:last").after(listColumn);
                }
            }
        });



        /**
         *   LoyaltyGrid
         *
         **/



        // function to render loyalty-grid
        function loyaltyGrid(currentSelectionType) {
            var inputElement = '<div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-9"><div class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><!--<span aria-hidden="true">×</span>--></button><strong>Loyalty grid</strong> is been applied. </div></div></div>';

            currentSelectionType.parents(".form-horizontal").children(".response-container").append(inputElement);
            currentSelectionType.parents(".btn-group").siblings(".simple-mixed-btn-group").removeClass("show").css("display", "none");
        }



        /**
         * Prog
         *
         **/



        // event to change prog at question level or at response level
        question_panel_container.on("change", "input[name='response-level-prog']", function () {
            if ($(this).is(":checked")) {
                $(this).parents(".col-sm-4").siblings(".col-sm-8").find(".response-level-ask-container").removeClass("hide").addClass("show");
            } else {
                $(this).parents(".col-sm-4").siblings(".col-sm-8").find(".response-level-ask-container").find(".response-ask").val("");
                $(this).parents(".col-sm-4").siblings(".col-sm-8").find(".response-level-ask-container").removeClass("show").addClass("hide");
            }
        });



        // event to add multiple ask-qn
        question_panel_container.on("click", ".ask-qn-btn", function () {
            var inputElement = '<div class="form-group ask-qn-container" style="margin-bottom:5px;margin-top:0px;"><div class="col-sm-4" style="margin:0px;padding-right:0px"><input type="text" class="form-control question-code" placeholder="Question Code"></div><div class="col-sm-4" style="margin:0px;padding-right:0px"><input type="text" class="form-control response-code" placeholder="Response Code"></div><div class="col-sm-3" style="margin:0px"><div class="checkbox"><label><input type="checkbox" checked="" class="equal"> Equal </label></div></div><div class="col-sm-1" style="margin:0px; padding-right:6px;"><span class="btn glyphicon glyphicon-remove remove-current-ask-qn-container pull-right" aria-hidden="true"></span></div></div>';

            $(this).parent("fieldset").append(inputElement);
        });



        // event to remove ask qn 
        question_panel_container.on("click", ".ask-qn-remove-btn", function () {
            $(this).closest(".form-group").remove();
        });


        // event to remove ask qn container
        question_panel_container.on("click", ".remove-current-ask-qn-container", function () {
            $(this).closest(".ask-qn-container").remove();
        });


        // event to remove question depend ask
        question_panel_container.on("click", ".remove-question-dependent-ask", function () {
            $(this).closest(".form-group").remove();
        });



        // event to add question dependent ask
        question_panel_container.on("click", ".ask-dropdown-menu li a", function () {
            var currentContext = $(this),
                as_link_name = currentContext.attr("name");

            switch (as_link_name) {
            case "response-level-ask":
                getResponseLevelAsk(currentContext);
                break;
            case "ask-if":
                getAskIf(currentContext);
                break;
            case "question-depend-on":
                getQuestionDependOn(currentContext);
                break;
            }
        });


        function getResponseLevelAsk(currentContext) {
            var inputElement = '<div class="form-group" style="margin-left:0px;"><div class="checkbox"><label><input type="checkbox" name="response-level-prog">&nbsp;Is Response Level Prog?</label></div></div>';

            currentContext.parents(".dropdown").siblings(".ask-container").append(inputElement);
        }


        function getAskIf(currentContext) {
            var inputElement = '<div class="question-level-ask-container"><div class="form-group" id="ask-qn" style="padding:0 10px; position:relative;"><fieldset><span class="glyphicon glyphicon-plus btn ask-qn-btn" aria-hidden="true" style="position:absolute; right:0px; top:-7px;"></span><legend style="margin-bottom:10px;font-size:14px;"><b>ASK If</b></legend><div class="form-group ask-qn-container" style="margin-bottom:5px;margin-top:0px;"><div class="col-sm-4" style="margin:0px;padding-right:0px"><input type="text" class="form-control question-code" placeholder="Question Code"></div><div class="col-sm-4" style="margin:0px;padding-right:0px"><input type="text" class="form-control response-code" placeholder="Response Code"></div><div class="col-sm-3" style="margin:0px"><div class="checkbox"><label><input type="checkbox" checked class="equal"> Equal </label></div></div><div class="col-sm-1" style="margin:0px; padding-right:6px;"><span class="btn glyphicon glyphicon-remove remove-current-ask-qn-container pull-right" aria-hidden="true"></span></div></div></fieldset></div><div class="form-group" style="padding:0 10px;"><fieldset><legend style="margin-bottom:0px;font-size:14px;">Condition</legend><div class="col-sm-4"><div class="radio"><label><input type="radio" value="AND" name="prog-ask-condition"> AND </label></div></div><div class="col-sm-4"><div class="radio"><label><input type="radio" value="OR" name="prog-ask-condition" checked> OR </label></div></fieldset></div></div>';

            currentContext.parents(".dropdown").siblings(".ask-container").append(inputElement);
        }


        function getQuestionDependOn(currentContext) {
            var inputElement = '<div class="form-group" style="margin-bottom:5px; margin-left:auto; margin-right:auto;"><fieldset><legend style="margin-bottom:10px;font-size:14px;"><b>Question Depend On</b></legend><div class="col-sm-5" style="margin:0px"><input type="text" id="question_ask_provider" class="form-control" placeholder="Question Code"></div><div class="col-sm-5" style="margin:0px"><input type="text" id="response_ask_provider" class="form-control" placeholder="Response Key"></div><div class="col-sm-2"><span class="glyphicon glyphicon-remove btn remove-question-dependent-ask" aria-hidden="true"></span></div></fieldset></div>';

            currentContext.parents(".dropdown").siblings(".ask-container").append(inputElement);
        }

        /**
         * Question JSON creation started
         *
         **/



        // function to handle next Question button
        $scope.nextQuestion = function () {
            if ($scope.QuestionNumber == 1) {
                startQuestionKey = $("#question-code").val();
                QuestionObject["StartQuestionKey"] = startQuestionKey;
            }

            $scope.QuestionNumber++;

            getInputValue();

            clearQuestionPanel();

        }; // end of nextQuestion



        // function to clear the question panel
        function clearQuestionPanel() {

            var question_panel_container = $(".question-panel-container"),
                no_of_question_panel = question_panel_container.find(".row").length;

            $(".simple-mixed-btn-group").removeClass("show").css("display", "none");

            for (var index = 1; index < no_of_question_panel; index++) {
                question_panel_container.find(".row:last").remove();
            }

            $("input#question-code").val("");
            $("textarea#question").val("");
            $(".response-container").empty();
            $("input#question-level-prog-ask").val("");
            $("input#question_ask_provider").val("");
            $("input#response_ask_provider").val("");
            $("input[name='prog-single-response']").prop("checked", true);
            $("input[name='prog-fixed']").prop("checked", true);
            $("input[name='prog-forced']").prop("checked", true);
            $(".ask-container").empty();
            $("input[name='response-level-prog']").prop("checked", false);


            var ask_qn = $(".ask-container"),
                ask_qn_container = ask_qn.find(".ask-qn-container"),
                question_code = ask_qn_container.find(".question-code").val(""),
                response_code = ask_qn_container.find(".response-code").val(""),
                equal_checkbox = ask_qn_container.find(".equal").prop("checked", true),
                condition = $("input[name='prog-ask-condition']:last").prop("checked", true);

            for (var index = 1; index < ask_qn_container.length; index++) {
                ask_qn.find("div.ask-qn-container:last").remove();
            }

        }



        // common utility function to get values from input box and create question JSON Object
        function getInputValue() {
            var GroupArray = [];

            var current_question_index = 1,
                no_of_questions_on_page = $(".question-panel-container .row").length,
                no_of_question_panel = $(".question-panel-container .row");

            no_of_question_panel.each(function () {
                var OneQuestionObjectPerQuestion = {},
                    AskProviderObject = {},
                    AskQnObject = {};

                var question_code = $(this).find("#question-code").val(),
                    question = $(this).find("#question").val(),
                    selectionType = $(this).find("#selection-type").attr("selectionType"),
                    prog_single_response = $(this).find("input[name='prog-single-response']"),
                    prog_fixed = $(this).find("input[name='prog-fixed']"),
                    prog_forced = $(this).find($("input[name='prog-forced']")),
                    question_level_prog_ask = $(this).find("input#question-level-prog-ask-radio"),
                    question_ask_provider = $(this).find("input#question_ask_provider"),
                    response_ask_provider = $(this).find("input#response_ask_provider"),
                    ask_qn = $(this).find("div#ask-qn .ask-qn-container"),
                    condition = $(this).find("input[name='prog-ask-condition']:checked");

                var is_ask_qn_provided = false;

                OneQuestionObjectPerQuestion["Question"] = question;
                OneQuestionObjectPerQuestion["SelectionType"] = selectionType;

                // prog validation
                if (prog_single_response.is(":checked")) {
                    OneQuestionObjectPerQuestion["PROG_Single_Response"] = true;
                }

                if (prog_fixed.is(":checked")) {
                    OneQuestionObjectPerQuestion["PROG_Fixed"] = true;
                }

                if (prog_forced.is(":checked")) {
                    OneQuestionObjectPerQuestion["PROG_Force"] = true;
                }

                if (question_level_prog_ask.is(":checked")) {
                    OneQuestionObjectPerQuestion["PROG_Ask"] = $("input#question-level-prog-ask").val();
                }

                if (question_ask_provider.length && response_ask_provider.length) {

                    if (question_ask_provider.val() != "" && response_ask_provider.val() != "") {
                        AskProviderObject["Qn_Key"] = question_ask_provider.val();
                        AskProviderObject["Resp_Key"] = response_ask_provider.val();

                        OneQuestionObjectPerQuestion["Ask_Provider"] = AskProviderObject;
                    }

                }

                var qn_key_array = [],
                    resp_key_array = [],
                    equal_array = [];

                if (ask_qn.length) {
                    ask_qn.each(function () {
                        var question_code = $(this).find(".question-code").val();
                        var response_code = $(this).find(".response-code").val();
                        var equal = $(this).find("input.equal").is(":checked");

                        if (question_code != "" && response_code != "") {
                            qn_key_array.push(question_code);
                            resp_key_array.push(response_code);
                            equal_array.push(equal);
                            is_ask_qn_provided = true;
                        }

                    });
                }

                if (is_ask_qn_provided) {
                    AskQnObject["Qn_Key"] = qn_key_array;
                    AskQnObject["Resp_Key"] = resp_key_array;
                    AskQnObject["Equals"] = equal_array;
                    AskQnObject["Condition"] = condition.val();

                    OneQuestionObjectPerQuestion["PROG_Ask_Qn"] = AskQnObject;
                }
                // end of prog validation

                var responseValueObject = {};

                switch (selectionType) {
                case "SimpleRadioOrCheckbox":
                    responseValueObject = getResponseForSimpleRadioOrCheckbox($(this));
                    break;
                case "SimpleMixed":
                    responseValueObject = getResponseForSimpleMixed($(this));
                    break;
                case "SingleGridRadioOrCheckbox":
                    responseValueObject = getResponseForSingleGridRadioOrCheckbox($(this));
                    break;
                case "SimpleDropDown":
                    responseValueObject = getResponseForSimpleDropdown($(this));
                    break;
                case "MultiDropDown":
                    OneQuestionObjectPerQuestion["List"] = getListValueObejct($(this));
                    responseValueObject = getResponseForMultiDropdown($(this));
                    break;
                case "LoyaltyGrid":
                    responseValueObject = getResponseForLoyaltyGrid($(this));
                    break;
                case "OSATGrid":
                    responseValueObject = getOSATGrid($(this));
                    break;
                case "StandardAttributeGrid":
                    responseValueObject = getStandardAttributeGrid($(this));
                    break;
                }

                OneQuestionObjectPerQuestion["index"] = questionIndexCount.toString();
                OneQuestionObjectPerQuestion["Responses"] = responseValueObject;

                if (current_question_index != no_of_questions_on_page) {
                    OneQuestionObjectPerQuestion["Navigation"] = false;
                    questionIndexCount++;
                } else {
                    OneQuestionObjectPerQuestion["Navigation"] = true;
                    questionIndexCount++;
                }

                if (no_of_questions_on_page > 1) {
                    GroupArray.push(question_code);
                }

                current_question_index++;

                QuestionObject[question_code] = OneQuestionObjectPerQuestion;
            });

            if (GroupArray[0]) {
                GroupObject[GroupArray[0]] = GroupArray;
            }

        }



        // function for handling question generation
        $scope.saveQuestion = function () {
            
            if ($scope.QuestionNumber == 1) {
                startQuestionKey = $("#question-code").val();
                QuestionObject["StartQuestionKey"] = startQuestionKey;
            }

            getInputValue();

            console.log("JSON Data to post: " + JSON.stringify(QuestionObject));

            if (Object.keys(QuestionObject).length != 0) {
                JDPAFactory.postQuestionJSON({
                        "Survey Name": surveyName,
                        "For": "MOBILE",
                        "Data": QuestionObject,
                        "Group": GroupObject
                    },
                    function (data, status) {
                        $scope.message = "inserted!";

                        if (status == "201") {
                            $('#save-alert').removeClass()
                                .addClass("alert alert-success");
                            $timeout(function () {
                            }, 4000);
                        } else {
                            $('#save-alert').removeClass()
                                .addClass("alert alert-warning");
                        }
                        $('#save-alert').css("display", "block").fadeOut(4000);
                    },
                    function (err) {
                        $scope.message = "Network Error!";
                        $('#save-alert').css("display", "block").fadeOut(4000);
                    });
            }

        }; // end of saveQuestion



        // function for saving partially
        $scope.saveQuestionPartially = function () {
            if ($scope.QuestionNumber == 1) {
                startQuestionKey = $("#question-code").val();
                QuestionObject["StartQuestionKey"] = startQuestionKey;
            }
            
            getInputValue();

            $log.debug("JSON Data for partially: " + JSON.stringify(QuestionObject));

            if (Object.keys(QuestionObject).length != 0) {
                JDPAFactory.postQuestionJSON({
                        "Survey Name": surveyName,
                        "For": "MOBILE_PARTIAL",
                        "Data": QuestionObject,
                        "Group": GroupObject
                    },
                    function (data, status) {
                        $scope.message = "inserted!";

                        if (status == "201") {
                            $('#save-alert').removeClass()
                                .addClass("alert alert-success");
                            $timeout(function () {
                            }, 4000);
                        } else {
                            $('#save-alert').removeClass()
                                .addClass("alert alert-warning");
                        }
                        $('#save-alert').css("display", "block").fadeOut(4000);
                    },
                    function (err) {
                        $scope.message = "Network Error!";
                        $('#save-alert').css("display", "block").fadeOut(4000);
                    });
            }
        };

        // get response json for SingleGridRadioOrCheckbox
        function getResponseForSingleGridRadioOrCheckbox(parentContainer) {
            var responseValueObject = {},
                rowKeyObject = {},
                columnKeyObject = {};

            var table_for_single_grid = parentContainer.find(".table-for-singlegrid"),
                no_of_rows = table_for_single_grid.find('.row-lbl-container'),
                no_of_columns = table_for_single_grid.find('.column-lbl-container'),
                rowKeyIndex = 1,
                columnKeyIndex = 1;

            no_of_rows.each(function () {
                var rowValueObject = {};

                var current_row = $(this),
                    response_code = current_row.find(".response-code").val(),
                    response = current_row.find("textarea[for='input-value-for-single-grid-radio-or-checkbox']").val();


                rowValueObject["value"] = response;

                if (response_code != "") {
                    rowKeyObject[response_code] = rowValueObject;
                } else {
                    rowKeyObject[rowKeyIndex] = rowValueObject;
                }

                rowKeyIndex++;
            });

            no_of_columns.each(function () {
                var columnValueObject = {};

                var current_column = $(this),
                    columnItem = current_column.find("input").val();


                columnValueObject["value"] = columnItem;
                columnValueObject["input"] = "radio";
                columnKeyObject[columnKeyIndex] = columnValueObject;

                columnKeyIndex++;
            });

            responseValueObject["row"] = rowKeyObject;
            responseValueObject["col"] = columnKeyObject;

            return responseValueObject;
        }



        // get response json for OSATGrid
        function getOSATGrid(parentContainer) {
            var responseValueObject = {},
                rowKeyObject = {},
                columnKeyObject = {};

            var table_for_osat_grid = parentContainer.find(".table-for-osatgrid"),
                no_of_rows = table_for_osat_grid.find('.row-lbl-container'),
                no_of_columns = table_for_osat_grid.find('.column-lbl-container'),
                rowKeyIndex = 1;

            no_of_rows.each(function () {
                var rowValueObject = {};

                var current_row = $(this),
                    response_code = current_row.find(".response-code").val(),
                    response = current_row.find("textarea[for='input-value-for-osat-grid']").val();


                rowValueObject["value"] = response;

                if (response_code != "") {
                    rowKeyObject[response_code] = rowValueObject;
                } else {
                    rowKeyObject[rowKeyIndex] = rowValueObject;
                }

                rowKeyIndex++;
            });

            columnKeyObject = {
                "1": {
                    "value": "1",
                    "input": "radio"
                },
                "2": {
                    "value": "2",
                    "input": "radio"
                },
                "3": {
                    "value": "3",
                    "input": "radio"
                },
                "4": {
                    "value": "4",
                    "input": "radio"
                },
                "5": {
                    "value": "5",
                    "input": "radio"
                },
                "6": {
                    "value": "6",
                    "input": "radio"
                },
                "7": {
                    "value": "7",
                    "input": "radio"
                },
                "8": {
                    "value": "8",
                    "input": "radio"
                },
                "9": {
                    "value": "9",
                    "input": "radio"
                },
                "10": {
                    "value": "10",
                    "input": "radio"
                }
            };

            responseValueObject["row"] = rowKeyObject;
            responseValueObject["col"] = columnKeyObject;

            return responseValueObject;
        }



        // get response json for StandardAttributeGrid
        function getStandardAttributeGrid(parentContainer) {
            var responseValueObject = {},
                excludedObject = {},
                rowKeyObject = {},
                columnKeyObject = {};

            var table_for_standard_attribute_grid = parentContainer.find(".table-for-standard-attribute-grid"),
                no_of_rows = table_for_standard_attribute_grid.find('.row-lbl-container'),
                no_of_columns = table_for_standard_attribute_grid.find('.column-lbl-container'),
                rowKeyIndex = 1;

            no_of_rows.each(function () {
                var rowValueObject = {};

                var current_row = $(this),
                    response_code = current_row.find(".response-code").val(),
                    response = current_row.find("textarea[for='input-value-for-single-grid-radio-or-checkbox']").val(),
                    isExcluded = current_row.find(".exclude").is(":checked");


                rowValueObject["value"] = response;


                if (response_code != "") {
                    rowKeyObject[response_code] = rowValueObject;
                } else {
                    rowKeyObject[rowKeyIndex] = rowValueObject;
                }


                if (!isExcluded) {

                    var sampleObject = {};

                    if (response_code != "") {
                        sampleObject[response_code] = "11";
                    } else {
                        sampleObject[rowKeyIndex] = "11";
                    }
                    excludedObject = sampleObject;
                }


                rowKeyIndex++;



            });

            columnKeyObject = {
                "1": {
                    "value": "1",
                    "input": "radio"
                },
                "2": {
                    "value": "2",
                    "input": "radio"
                },
                "3": {
                    "value": "3",
                    "input": "radio"
                },
                "4": {
                    "value": "4",
                    "input": "radio"
                },
                "5": {
                    "value": "5",
                    "input": "radio"
                },
                "6": {
                    "value": "6",
                    "input": "radio"
                },
                "7": {
                    "value": "7",
                    "input": "radio"
                },
                "8": {
                    "value": "8",
                    "input": "radio"
                },
                "9": {
                    "value": "9",
                    "input": "radio"
                },
                "10": {
                    "value": "10",
                    "input": "radio"
                },
                "11": {
                    "value": "N/A",
                    "input": "radio"
                }
            };

            responseValueObject["row"] = rowKeyObject;
            responseValueObject["col"] = columnKeyObject;
            responseValueObject["Exclude"] = excludedObject;

            return responseValueObject;
        }



        // get response json for SimpleRadioOrCheckbox
        function getResponseForSimpleRadioOrCheckbox(parentContainer) {
            var rowKeyObject = {};

            var response_container = parentContainer.find(".response-container .form-group"),
                rowKeyIndex = 1;

            response_container.each(function () {
                var rowValueObject = {};

                var current_container = $(this),
                    response_code = current_container.find(".response-code").val(),
                    response = current_container.find("textarea[for='input-value-for-simple-radio-or-checkbox']").val(),
                    response_ask = current_container.find(".response-ask").val();

                rowValueObject["value"] = response;
                rowValueObject["input"] = "radio";

                if (response_code != "") {
                    if (response_ask != "")
                        rowValueObject["PROG_Ask"] = response_ask;

                    rowKeyObject[response_code] = rowValueObject;
                } else {
                    if (response_ask != "")
                        rowValueObject["PROG_Ask"] = response_ask;

                    rowKeyObject[rowKeyIndex] = rowValueObject;
                }

                rowKeyIndex++;
            });

            return rowKeyObject;
        }



        // get response json for LoyaltyGrid
        function getResponseForLoyaltyGrid(parentContainer) {
            var responseValueObject = {};

            responseValueObject = {
                "1": {
                    "value": "Definitely will not",
                    "input": "radio"
                },
                "2": {
                    "value": "Probably will not",
                    "input": "radio"
                },
                "3": {
                    "value": "Probably will",
                    "input": "radio"
                },
                "4": {
                    "value": "Definitely will",
                    "input": "radio"
                },
                "5": {
                    "value": "Don't know",
                    "input": "radio"
                }
            }

            return responseValueObject;
        }



        // get response json for SimpleDropdown
        function getResponseForSimpleDropdown(parentContainer) {
            var rowKeyObject = {};

            var response_container = parentContainer.find(".response-container .form-group"),
                rowKeyIndex = 1;

            response_container.each(function () {
                var rowValueObject = {};

                var current_container = $(this),
                    response = current_container.find("textarea[for='input-value-for-simple-dropdown']").val();

                rowValueObject["value"] = response;
                rowValueObject["input"] = "radio";

                rowKeyObject[rowKeyIndex] = rowValueObject;

                rowKeyIndex++;
            });

            return rowKeyObject;
        }



        // get response json for MultiDropdown
        function getResponseForMultiDropdown(parentContainer) {
            var responseKeyObject = {};

            var table_for_multidropdown = parentContainer.find(".table-for-multidropdown");

            // for L1 L2 ....
            table_for_multidropdown.find("thead th").each(function () {
                var rowIndex = 1;
                var listLevel = $(this).find("textarea").attr("name");
                var columnTitle = $(this).find("textarea").val();
                var responseValueObject = {};

                table_for_multidropdown.find("tbody td[role='" + listLevel + "']").find("textarea").each(function () {
                    var singleColumnItemValueObject = {};
                    responseValueObject = {};
                    var columnItem = $(this).val();
                    if (columnItem != "") {
                        singleColumnItemValueObject["Name"] = columnTitle;
                        singleColumnItemValueObject["value"] = columnItem;

                        responseValueObject["value"] = singleColumnItemValueObject;
                        responseValueObject["input"] = "radio";

                        responseKeyObject[listLevel + "_" + rowIndex] = responseValueObject;
                        rowIndex = rowIndex + 1;
                    }
                });
            });

            return responseKeyObject;
        }



        // get response json for MultiDropdown
        function getResponseForSimpleMixed(parentContainer) {
            var rowKeyObject = {};
            var question = parentContainer.find("textarea#question").val();

            var response_container = parentContainer.find(".response-container .form-group"),
                rowKeyIndex = 1;

            response_container.each(function () {
                var rowValueObject = {};

                var current_container = $(this),
                    response_code = current_container.find(".response-code").val();

                if (current_container.find(".for-textbox").length) {
                    var input_text = current_container.find(".for-textbox").val(),
                        value = question,
                        input = current_container.find(".for-textbox").attr("role");

                    rowValueObject["value"] = value;
                    rowValueObject["input"] = input;
                    rowValueObject["input_text"] = input_text;
                } else {
                    var value = current_container.find(".for-checkbox-or-radio").val();

                    rowValueObject["value"] = value;
                    rowValueObject["input"] = "checkbox";
                }

                if (response_code != "") {
                    rowKeyObject[response_code] = rowValueObject;
                } else {
                    rowKeyObject[rowKeyIndex] = rowValueObject;
                }

                rowKeyIndex++;
            });
            return rowKeyObject;
        }



        // function to get List for MultiDropdown
        function getListValueObejct(parentContainer) {
            var listValueObejct = {};

            var table_for_multidropdown = parentContainer.find(".table-for-multidropdown"),
                columnCount = table_for_multidropdown.find("thead th").length;;

            // event to create listValueObject object
            table_for_multidropdown.find("tbody td").each(function () {
                var columnName = $(this).attr("role");
                var columnItemCount = 0;

                $("td[role='" + columnName + "']").find("textarea").each(function () {
                    if ($(this).val() != "") {
                        columnItemCount = columnItemCount + 1;
                    }
                });

                listValueObejct[columnName] = columnItemCount.toString();
            });

            listValueObejct["Column_Count"] = columnCount.toString();

            return listValueObejct;
        }



        // function to handle previous question button    
        $scope.previousQuestion = function () {}; // end of previousQuestion

}]);