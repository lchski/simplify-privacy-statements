import React, { Component } from "react";
import { connect } from "react-redux";
import JsxParser from "react-jsx-parser";
import PropTypes from "prop-types";
import MarkdownIt from "markdown-it";
import VariableColouring from "./variable_colouring";

export class Agreement extends Component {
  nameForId = (sheet, id) => {
    let row = sheet.filter(r => r.id === id)[0];
    if (row) {
      return row.variable_name;
    }
    return null;
  };

  evaluateRowConditions = (row, variables, options, userValues) => {
    const { logic_type, variable_1, test, variable_2 } = row;

    if (logic_type === "none") {
      return true;
    }
    if (variable_1 === undefined || variable_2 === undefined) {
      return false;
    }

    let returnValue = false;
    const v1Name = this.nameForId(variables, variable_1[0]);
    const v1Value = userValues[v1Name];
    const v2Values = variable_2.map(v => this.nameForId(options, v));

    if (logic_type === "if" && test === "in_list") {
      v2Values.forEach(v2 => {
        if (v1Value === v2) {
          returnValue = true;
        }
      });
    }

    if (row.logic_type === "if" && test === "equals") {
      if (v2Values.length === 1 && v1Value === v2Values[0]) {
        returnValue = true;
      }
    }

    if (row.logic_type === "if" && test === "does_not_equal") {
      if (v2Values.length === 1 && v1Value !== v2Values[0]) {
        returnValue = true;
      }
    }
    return returnValue;
  };

  colouringFunction = (match, p1) => {
    const variableSelected = this.props.reduxState.variableSelected;
    const variableValue = this.props.reduxState[p1];
    return `<VariableColouring variableSelected='${variableSelected}' variable='${p1}' variableValue='${variableValue}'/>`;
  };

  colourRow = (match, variable, display_text) => {
    let retval;

    console.log("-----------------------------");
    console.log("match: ZZ", match, "ZZ");

    // console.log("variable", variable, "text |" + display_text + "|")

    const variableSelected = this.props.reduxState.variableSelected;
    if (variable !== "undefined") {
      retval = `<VariableColouring variableSelected='${variableSelected}' variable='${variable}' variableValue='${display_text}'/>`;
    } else {
      retval = display_text;
    }

    console.log("retval: ZZ", retval, "ZZ");

    console.log("============================");
    return retval;
  };

  render() {
    const { reduxState } = this.props;

    console.log("\n\n------- Render -------");
    const finalTemplate = reduxState.template
      .filter(
        (row, index) =>
          index >= 5 &&
          index <= 7 &&
          this.evaluateRowConditions(
            row,
            reduxState.questions,
            reduxState.multiple_choice_options,
            reduxState
          )
      )
      .map(
        row =>
          this.props.showSection && row.section_name !== undefined
            ? `|${this.nameForId(
                reduxState.multiple_choice_options,
                row.variable_1
              )}, **[${row.section_name}]**\n ${row.display_text}|`
            : `|${this.nameForId(
                reduxState.multiple_choice_options,
                row.variable_1
              )}, ${row.display_text}|`
      )
      .map(s => s.replace(/^\*\s/, "\n* "))
      .join("");

    let md = new MarkdownIt({ breaks: true });

    let jsxString = md
      .render(finalTemplate)
      .replace(/<br>/g, "<br/>")
      .replace(/<p>/g, "<br/><br/>")
      .replace(/<\/p>/g, "")
      .replace(/\{(\S+)\}/g, this.colouringFunction)
      .replace(/\|([\S]+), ([^|]+)\|/g, this.colourRow);

    return (
      <JsxParser
        bindings={reduxState}
        components={{ VariableColouring }}
        jsx={jsxString}
      />
    );
  }
}

const mapStateToProps = reduxState => {
  return {
    reduxState: reduxState
  };
};

Agreement.propTypes = {
  reduxState: PropTypes.object,
  showSection: PropTypes.bool
};

export default connect(mapStateToProps)(Agreement);
