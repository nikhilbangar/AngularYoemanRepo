"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("CreateQuestionForWebController", ["$scope", "$routeParams", "JDPAFactory",
    function ($scope, $routeParams, JDPAFactory) {
        $scope.QuestionNumber = "1";
        
        var surveyName = $routeParams.filename;
        var QuestionObject = {},
            GroupObject = {};
        
        var flag = false;
        var questionTitle = null;
        var startQuestionKey = "";
        var question_panel_container = $(".question-panel-container");



        // event to add new question panel on add question btn click
        $(".add-question-btn").click(function () {
            var newQuestionPanel = '<div class="row"><!-- question panel --><div class="col-sm-12" style="margin-bottom:5px"><button class="btn btn-primary remove-question-btn pull-right" type="submit">Remove Question | ×</button></div><div class="col-sm-8"><div class="panel panel-info panel-question panel-info-question-web"><div class="panel-heading"><div class="panel-title question-title-web "></div></div><div class="panel-body"><form class="form-horizontal ng-pristine ng-valid"><div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label">Question Code</label><div class="col-sm-4"><input type="text" class="form-control" id="question-code"></div><div class="btn-group" style="margin-right:4px;"><button type="button" class="btn btn-danger">ADD Element</button><button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul class="dropdown-menu selectionType-dropdown" role="menu"><li><a role="simple-radio-or-checkbox">SimpleRadioOrCheckbox</a></li><li><a role="simple-mixed">SimpleMixed</a></li><li><a role="simple-dropdown">SimpleDropDown</a></li><li><a role="multi-dropdown">MultiDropDown</a></li><li><a role="single-grid-radio-or-checkbox">SingleGridRadioOrCheckbox</a></li><li><a role="loyalty-grid">LoyaltyGrid</a></li></ul></div><div class="btn-group simple-mixed-btn-group hide"><button type="button" class="btn btn-danger">ADD Mixed Element</button><button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul class="dropdown-menu simplemix-dropdown" role="menu"><li><a role="textbox">Textbox</a></li><li><a role="textarea">Textarea</a></li><li><a role="checkbox-or-radio">CheckboxOrRadio</a></li></ul></div></div><div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label">Question</label><div class="col-sm-9"><textarea id="question" class="form-control" rows="5" style="width:100%" required=""></textarea></div></div><div id="selection-type" class="response-container" selectiontype=""><div class="list-question-container-web hide"><div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-4"><div class="input-group" id="noOfList"><input id="no-of-list-input" type="number" min="1" class="form-control" name="textbox" maxlength="2" placeholder="Number of List" aria-describedby="basic-addon2"><span class="btn input-group-addon" ng-click="generateList()">ADD COLUMN </span></div></div></div><div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-9" style="overflow-x:scroll;overflow-y:scroll;"><table class="table table-striped table-for-list"><thead><tr><th><input type="text" placeholder="Title" name="L1" class="form-control"></th></tr></thead><tbody><tr><td scope="row" role="L1"><input type="text" class="form-control"><input type="text" class="form-control"></td></tr></tbody></table></div></div></div></div></form></div><!-- end of panel body --></div><!-- end of panel --></div><!-- prog panel --><div class="col-sm-4"><div class="panel panel-info panel-info-prog-web"><div class="panel-heading"><div class="panel-title">PROG</div></div><div class="panel-body"><form class="form-horizontal form-horizontal-prog-web"><div class="form-group prog-for-no-validation-container"><div class="col-sm-8"><div class="input-group" id="text-type"><span class="input-group-addon" ng-click=""><input type="checkbox" name="prog-single-response" checked value="SINGLE RESPONSE"></span><label class="form-control" name="textbox" aria-describedby="basic-addon2">Single Response</label></div></div></div><div class="form-group prog-for-no-validation-container"><div class="col-sm-8"><div class="input-group" id="text-type"><span class="input-group-addon" ng-click=""><input type="checkbox" name="prog-fixed" checked value="FIXED"></span><label class="form-control" name="textbox" aria-describedby="basic-addon2">Fixed</label></div></div></div><div class="form-group prog-for-no-validation-container"><div class="col-sm-8"><div class="input-group" id="text-type"><span class="input-group-addon" ng-click=""><input type="checkbox" name="prog-forced" checked value="FORCED"></span><label class="form-control" name="textbox" aria-describedby="basic-addon2">Forced</label></div></div></div><div class="form-group hide"><div class="col-sm-4"><button class="btn btn-default validation-prog-btn">Validation</button></div><div class="col-sm-4 validation-prog" style="display:none;"><div class="input-group"><div class="input-group-addon">Min</div><input type="text" name="Min" class="form-control"></div></div><div class="col-sm-4 validation-prog" style="display:none;"><div class="input-group"><div class="input-group-addon">Max</div><input type="text" name="Max" class="form-control"></div></div></div><div class="form-group" style="padding:0 10px;"><fieldset><legend style="margin-bottom:0px;">ASK</legend><div class="checkbox"><input type="radio" value="question-level-prog-ask-radio" name="mobile-prog-ask" checked value="question-level-prog">&nbsp;Question level <div class="question-level-ask-container"><div class="input-group col-sm-5 question-level-ask" style="margin-bottom:5px"><span class="input-group-addon">ASK</span><input id="question-level-prog-ask" type="text" class="form-control" aria-describedby="basic-addon2"></div></div></div><label class="checkbox response-level-prog-checkbox hide"><input type="radio" name="mobile-prog-ask" value="response-level-prog">&nbsp;Response level </label></fieldset></div><div class="form-group" style="padding:0 10px; position:relative;"><fieldset><legend style="margin-bottom:10px;">ASK_Provider</legend><div class="form-group" style="margin-bottom:5px"><div class="col-sm-5" style="margin:0px"><input type="text" id="question_ask_provider" class="form-control" placeholder="Question Code"></div><div class="col-sm-5" style="margin:0px"><input type="text" id="response_ask_provider" class="form-control" placeholder="Response Key"></div></div></fieldset></div><div class="form-group" id="ask-qn" style="padding:0 10px; position:relative;"><fieldset><span class="glyphicon glyphicon-plus btn ask-qn-btn" aria-hidden="true" style="position:absolute; right:0px"></span><legend style="margin-bottom:10px;">ASK_Qn</legend><div class="form-group ask-qn-container" style="margin-bottom:5px"><div class="col-sm-4" style="margin:0px"><input type="text" class="form-control question-code" placeholder="Question Code"></div><div class="col-sm-4" style="margin:0px"><input type="text" class="form-control response-code" placeholder="Response Key"></div><div class="col-sm-4" style="margin:0px;"><div class="input-group"><span class="input-group-addon"><input type="checkbox" class="equal"></span><label class="form-control" aria-describedby="basic-addon2">Equal</label></div></div></div></fieldset></div><div class="form-group" style="padding:0 10px;"><fieldset><legend style="margin-bottom:10px;">Condition</legend><div class="form-inline"><div class="form-group" style="margin:0px;"><div class="input-group"><span class="input-group-addon"><input type="radio" value="AND" name="prog-ask-condition"></span><label class="form-control" aria-describedby="basic-addon2">AND</label></div></div><div class="form-group" style="margin:0px;"><div class="input-group"><span class="input-group-addon"><input type="radio" value="OR" name="prog-ask-condition" checked></span><label class="form-control" aria-describedby="basic-addon2">OR</label></div></div></div></fieldset></div></form></div></div></div><!-- end of prog panel --></div>';

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
            case "grid-with-text":
                gridWithText($(this));
                break;
            }

        });



        /**
         *   SimpleRadioOrCheckbox
         *
         **/


        // function to render simple-radio-or-checkbox
        function simpleRadioOrCheckbox(currentSelectionType) {
            var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-2"><input type="text" class="form-control response-code" placeholder="Code"></div><div class="col-sm-7"><textarea for="input-value-for-simple-radio-or-checkbox" class="form-control" placeholder="Response value"></textarea><div class="response-level-ask-container hide"><div class="input-group" style="margin-bottom:5px"><span class="input-group-addon">ASK</span><input type="text" class="form-control response-ask" aria-describedby="basic-addon2"></div></div></div></div>';

            currentSelectionType.parents(".form-horizontal").children(".response-container").append(inputElement);
            currentSelectionType.parents(".btn-group").siblings(".simple-mixed-btn-group").removeClass("show").css("display", "none");

            $(".response-level-prog-checkbox").removeClass("hide").addClass("show");
        }



        // event to delete response at level 1 for simpleRadioOrCheckbox
        question_panel_container.on("click", ".btn-delete-at-level1", function (e) {
            $(this).closest(".form-group").remove();
        });



        // event to dynamically add column label in SimpleRadioOrCheckbox
        question_panel_container.on("keydown", ".response-container .form-group textarea[for='input-value-for-simple-radio-or-checkbox']:last", function (e) {
            if (e.which == "9") {
                var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-2"><input type="text" class="form-control response-code" placeholder="Code"></div><div class="col-sm-7"><div class="input-group" style="margin-left:0px;"><textarea for="input-value-for-simple-radio-or-checkbox" class="form-control" placeholder="Response value"></textarea><span class="btn input-group-addon btn-delete-at-level1"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div><div class="response-level-ask-container hide"><div class="input-group" style="margin-bottom:5px"><span class="input-group-addon">ASK</span><input type="text" class="form-control response-ask" aria-describedby="basic-addon2"></div></div></div></div>';

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

                    var elementString = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-2"><input type="text" class="form-control response-code" placeholder="Code"></div><div class="col-sm-4"><!--<div class="input-group" style="margin-left:0px;">--><textarea role="' + role + '" for="input-value-for-simple-mixed" class="form-control" placeholder="' + placeHolder + '"></textarea><!--<span class="btn input-group-addon btn-delete-at-level1"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div>--></div><div class="col-sm-3"><div class="input-group" style="margin-left:0px;"><textarea class="form-control for-textbox" placeholder="Textbox"></textarea><span class="btn input-group-addon btn-delete-at-level1"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div>';
                    break;
                case "textarea":
                    role = "textarea";
                    placeHolder = "Textarea Value";

                    var elementString = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-2"><input type="text" class="form-control response-code" placeholder="Code"></div><div class="col-sm-4"><!--<div class="input-group" style="margin-left:0px;">--><textarea role="' + role + '" for="input-value-for-simple-mixed" class="form-control" placeholder="' + placeHolder + '"></textarea><!--<span class="btn input-group-addon btn-delete-at-level1"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div>--></div><div class="col-sm-3"><div class="input-group" style="margin-left:0px;"><textarea class="form-control for-textbox" placeholder="Textbox"></textarea><span class="btn input-group-addon btn-delete-at-level1"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div>';
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
         *   SimpleDropDown
         *
         **/


        function gridWithText(currentSelectionType) {
            var inputElement = '<div class="form-group gridWithText"> <label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"> </label> <div class="col-sm-9" style="overflow-x:scroll;overflow-y:scroll;"> <table class="table table-striped table-for-singlegrid1"> <tbody> <tr> <td style="width:66%"> <div class="row-lbl-container" style="margin-bottom:1px;"> <div class="col-xs-12 col-md-12 col-sm-12"> <div class="col-md-3"> <input type="text" class="form-control response-code" placeholder="Code" style="max-width:76px;float:left;margin-right:5px;"> </div><div class="col-md-6"> <textarea for="input-value-for-single-grid1-radio-or-checkbox" class="form-control" placeholder="Row Label"> </textarea> </div><div class="col-md-3"> <input type="text" class="form-control gridTextBox"> </div></div></div></td><td> <div class="column-lbl-container" style="margin-bottom:10px;"> <input type="text" class="form-control" placeholder="Column Label"> </div></td></tr></tbody> </table> </div></div>';

            currentSelectionType.parents(".form-horizontal").children(".response-container").append(inputElement);
            currentSelectionType.parents(".btn-group").siblings(".simple-mixed-btn-group").removeClass("show").css("display", "none");

        }

        question_panel_container.on("keydown", ".form-group .table-for-singlegrid1 td:nth-child(1) textarea:last", function (e) {
            if (e.which == "9") {
                var inputElement = '<div class="row-lbl-container" style="margin-bottom:2px;"> <div class="col-xs-12 col-md-12 col-sm-12"><br> <div class="col-xs-3 col-md-3 col-sm-3"> <input type="text" class="form-control response-code" placeholder="Code" style="max-width:76px;float:left;margin-right:5px;"> </div><div class="col-xs-6 col-md-6 col-sm-6"><div class="input-group"> <textarea for="input-value-for-single-grid1-radio-or-checkbox" class="form-control" placeholder="Row Label"></textarea> <span class="btn input-group-addon remove-row-for-single-grid-radio-or-checkbox"> <span class="glyphicon glyphicon-remove" aria-hidden="true"> </span> </span></div></div><div class="col-xs-3 col-md-3 col-sm-3"><input type="text" class="form-control gridTextBox"></div></div>';

                $(this).parents("td").append(inputElement);
            }
        });

        question_panel_container.on("keydown", ".response-container .form-group .table-for-singlegrid1 td:nth-child(2) input:last", function (e) {
            if (e.which == "9") {
                var inputElement = '<div class="column-lbl-container" style="margin-bottom:10px;"><div class="input-group"><input type="text" class="form-control" placeholder="Column Label"><span class="btn input-group-addon remove-column-for-single-grid-radio-or-checkbox"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div>';

                $(this).parents("td").append(inputElement);
            }
        });







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
            var inputElement = '<div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-9" style="overflow-x:scroll;overflow-y:scroll;"><table class="table table-striped table-for-loyaltygrid"><tbody><tr><td scope="row" style="width:66%; padding-left:0px;"><div class="column-lbl-container" style="margin-bottom:84px;"><div class="form-group col-sm-9" style="display:inherit"><textarea class="form-control" placeholder="Column Label"></textarea></div></div></td></tr></tbody></table></div></div>';

            currentSelectionType.parents(".form-horizontal").children(".response-container").append(inputElement);
            currentSelectionType.parents(".btn-group").siblings(".simple-mixed-btn-group").removeClass("show").css("display", "none");
        }



        // event to dynamically add column label in LoyaltyGrid
        question_panel_container.on("keydown", ".response-container .form-group .table-for-loyaltygrid td textarea:last", function (e) {
            if (e.which == "9") {
                var inputElement = '<div class="column-lbl-container" style="margin-bottom:84px;"><div class="form-group col-sm-9" style="display:inherit"><div class="input-group"><textarea class="form-control" placeholder="Column Label"></textarea><span class="btn input-group-addon remove-column-for-loyalty-grid"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div>';

                $(this).parents("td").append(inputElement);
            }
        });



        // event to remove column from SingleGridRadioOrCheckbox
        question_panel_container.on("click", ".remove-column-for-loyalty-grid", function () {
            $(this).closest(".column-lbl-container").remove();
        });



        /**
         * Prog
         *
         **/



        // event to change prog at question level or at response level
        question_panel_container.on("change", "input[name='mobile-prog-ask']", function () {
            if ($(this).val() === "question-level-prog") {
                $(this).siblings(".question-level-ask-container").removeClass("hide").addClass("show");
                $(this).parents(".col-sm-4").siblings(".col-sm-8").find(".response-level-ask-container").removeClass("show").addClass("hide");
            } else
            if ($(this).val() === "response-level-prog") {
                $(this).siblings(".question-level-ask-container").removeClass("show").addClass("hide");
                $(this).parents(".col-sm-4").siblings(".col-sm-8").find(".response-level-ask-container").removeClass("hide").addClass("show");

            }
        });



        // event to add multiple ask-qn
        question_panel_container.on("click", ".ask-qn-btn", function () {
            var inputElement = '<div class="form-group ask-qn-container" style="margin-bottom:5px"><div class="col-sm-4" style="margin:0px"><input type="text" class="form-control question-code" placeholder="Question Code"></div><div class="col-sm-4" style="margin:0px"><input type="text" class="form-control response-code" placeholder="Response Key"></div><div class="col-sm-4" style="margin:0px"><div class="input-group"><span class="input-group-addon"><input type="checkbox" class="equal"></span><label class="form-control" aria-describedby="basic-addon2">Equal</label></div></div></div>';

            $(this).parent("fieldset").append(inputElement);
        });



        // event to remove ask qn 
        question_panel_container.on("click", ".ask-qn-remove-btn", function () {
            $(this).closest(".form-group").remove();
        });



        /**
         * Question JSON creation started
         *
         **/



        // function to handle next Question button
        $scope.nextQuestion = function () {
            if ($scope.QuestionNumber == 1) {
                     startQuestionKey = $("#question-code").val();
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
            
            for(var index = 1; index < no_of_question_panel; index++){
                    question_panel_container.find(".row:last").remove();
            }
            
            $("input#question-code").val("");
            $("textarea#question").val("");
            $(".response-container").empty();
            $("input#question-level-prog-ask").val("");
            $("input#question_ask_provider").val("");
            $("input#response_ask_provider").val("");
            
            var ask_qn = $("#ask-qn"),
                ask_qn_container = ask_qn.find(".ask-qn-container"),
                question_code = ask_qn_container.find(".question-code").val(""),
                response_code = ask_qn_container.find(".response-code").val(""),
                equal_checkbox = ask_qn_container.find(".equal").prop("checked",false);
                
            for(var index = 1; index < ask_qn_container.length; index++){
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
                    OneQuestionObjectPerQuestion["PROG_Single_Respose"] = true;
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

                if (question_ask_provider.val() != "" && response_ask_provider.val() != "") {
                    AskProviderObject["Qn_Key"] = question_ask_provider.val();
                    AskProviderObject["Resp_Key"] = response_ask_provider.val();

                    OneQuestionObjectPerQuestion["Ask_Provider"] = AskProviderObject;
                }

                var qn_key_array = [],
                    resp_key_array = [],
                    equal_array = [];

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
                    //                    alert('SingleGridRadioOrCheckbox');    
                    responseValueObject = getResponseForSingleGridRadioOrCheckbox($(this));
                    break;
                case "GridRadioOrCheckbox":
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
                case "GridTextbox":
                    responseValueObject = getResponseForGridWithText($(this));
                    break;
                }


                OneQuestionObjectPerQuestion["Responses"] = responseValueObject;

                if (current_question_index != no_of_questions_on_page) {
                    OneQuestionObjectPerQuestion["Navigation"] = false;
                } else {
                    OneQuestionObjectPerQuestion["Navigation"] = true;
                }
                alert("no_of_questions_on_page: " + no_of_questions_on_page);
                if(no_of_questions_on_page > 1){
                    GroupArray.push(question_code);
                }

                current_question_index++;
                
                QuestionObject["StartQuestionKey"] = startQuestionKey; 
                QuestionObject[question_code] = OneQuestionObjectPerQuestion;
            });
            
            if(GroupArray[0]){
                GroupObject[GroupArray[0]] = GroupArray;
            }    

        }


        
        // function for handling question generation
        $scope.saveQuestion = function () {
            
                getInputValue();

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
                rowValueObject["input"] = "radio";

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
                columnKeyObject[columnKeyIndex] = columnValueObject;

                columnKeyIndex++;
            });

            responseValueObject["row"] = rowKeyObject;
            responseValueObject["col"] = columnKeyObject;

            return responseValueObject;
        }

        function getResponseForGridWithText(parentContainer) {

            var responseValueObject = {},
                rowKeyObject = {},
                columnKeyObject = {};

            var table_for_single_grid1 = parentContainer.find(".table-for-singlegrid1"),
                no_of_rows = table_for_single_grid1.find('.row-lbl-container'),
                no_of_columns = table_for_single_grid1.find('.column-lbl-container'),
                rowKeyIndex = 1,
                columnKeyIndex = 1;

            no_of_rows.each(function () {
                var rowValueObject = {};
                var responseText = [];

                var current_row = $(this),
                    response_code = current_row.find(".response-code").val(),
                    response = current_row.find("textarea[for='input-value-for-single-grid1-radio-or-checkbox']").val(),
                    resTextVal = current_row.find('.gridTextBox').val();
                    responseText.push(resTextVal);

                rowValueObject["value"] = response;
                rowValueObject["input_text"] = responseText;

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
                    columnItem = current_column.find("input").val(),
                    columnType = current_column.find("input").prop("type");


                columnValueObject["value"] = columnItem;
                columnValueObject['input'] = columnType+"box";
                columnKeyObject[columnKeyIndex] = columnValueObject;

                columnKeyIndex++;
            });

            responseValueObject["row"] = rowKeyObject;
            responseValueObject["col"] = columnKeyObject;

           
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
                    rowValueObject["PROG_Ask"] = response_ask;
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



        // get response json for LoyaltyGrid
        function getResponseForLoyaltyGrid(parentContainer) {
            var responseValueObject = {},
                rowValueObject = {},
                rowKeyObject = {},
                columnKeyObject = {};

            var table_for_loyaltygrid = parentContainer.find(".table-for-loyaltygrid"),
                no_of_columns = table_for_loyaltygrid.find(".column-lbl-container"),
                columnKeyIndex = 1;

            rowValueObject["value"] = "";
            rowValueObject["input"] = "radio";

            rowKeyObject["1"] = rowValueObject;


            no_of_columns.each(function () {
                var columnValueObject = {};

                var current_column = $(this),
                    columnItem = current_column.find("textarea").val();


                columnValueObject["value"] = columnItem;
                columnKeyObject[columnKeyIndex] = columnValueObject;

                columnKeyIndex++;
            });

            responseValueObject["row"] = rowKeyObject;
            responseValueObject["col"] = columnKeyObject;

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

            var response_container = parentContainer.find(".response-container .form-group"),
                rowKeyIndex = 1;

            response_container.each(function () {
                var rowValueObject = {};

                var current_container = $(this),
                    response_code = current_container.find(".response-code").val();

                if (current_container.find(".for-textbox").length) {
                    var input_text = current_container.find(".for-textbox").val(),
                        value = current_container.find("textarea[for='input-value-for-simple-mixed']").val(),
                        input = current_container.find("textarea[for='input-value-for-simple-mixed']").attr("role");
                    
                    rowValueObject["value"] = value;
                    rowValueObject["input"] = input;
                    rowValueObject["input_text"] = input_text;
                }else{
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