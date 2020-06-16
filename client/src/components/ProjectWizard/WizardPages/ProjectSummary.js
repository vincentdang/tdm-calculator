import React from "react";
import PropTypes from "prop-types";
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-loader";

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto",
    minWidth: "600px"
  },
  subtitle: {
    marginBottom: 0
  },
  alignCenter: {
    textAlign: "center"
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: "20px"
  },
  measure: {
    height: "132px",
    minWidth: "293px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Oswald"
  },
  measureValue: {
    fontSize: "42px",
    marginTop: "33px",
    fontWeight: "bold"
  },
  measurePercent: {
    fontSize: "24px",
    marginLeft: "3px"
  },
  label: {
    fontSize: "16px",
    fontWeight: 500,
    marginTop: "10px",
    textTransform: "uppercase"
  },
  heading: {
    marginTop: "1em"
  },
  rule: {
    width: "100%",
    display: "flex",
    minHeight: "30px"
  },
  ruleName: {
    width: "350px",
    // flex: "1 1 auto",
    fontFamily: "Calibri",
    fontSize: "16px"
  },
  wideRule: {
    flex: "1 0 75%"
  },
  value: {
    fontFamily: "Oswald",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "right"
  },
  ruleUnits: {
    flex: "0 0 20%",
    paddingLeft: "1em"
  },
  icon: {
    flex: "0 0 5%"
  },
  calcUnits: {
    margin: "3px 12px 0 10px"
  },
  overline: {
    borderTop: "2px solid black"
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: "1em",
    justifyContent: "space-evenly"
  },
  bold: {
    fontFamily: "Calibri Bold"
  },
  loaderContainer: {
    width: "100%",
    height: "50px",
    display: "flex",
    justifyContent: "center"
  },
  lastSaved: {
    fontSize: "14px",
    color: "#6F6C64"
  },
  lastSavedContainer: {
    margin: "24px auto 0"
  },
  projectInfoContainer: {
    margin: "70px auto 0",
    width: "100%",
    minHeight: "100px"
  },
  textProjectInfoHeader: {
    fontSize: "18px",
    fontWeight: "900",
    fontFamily: "Calibri Bold"
  },
  projectInfoDetailsContainer: {
    borderTop: "1px solid #E7EBF0",
    marginTop: "13px",
    paddingTop: "13px",
    height: "55px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: "100%"
  },
  projectInfoDetailsSubContainer: {
    display: "flex",
    alignItems: "center",
    maxHeight: "20px",
    width: "50%"
  },
  projectInfoCategory: {
    fontFamily: "Oswald",
    fontSize: "12px",
    textTransform: "uppercase",
    textAlign: "right",
    color: "rgba(15, 41, 64, 0.5)",
    minWidth: "100px",
    marginRight: "17px"
  },
  projectInfoDetails: {
    fontSize: "16px",
    fontFamily: "Calibri Bold"
  },
  categoryContainer: {
    marginTop: "40px"
  },
  categoryHeader: {
    fontFamily: "Oswald",
    fontSize: "16px",
    fontWeight: "bold"
  },
  resultsContainer: {
    borderTop: "1px solid #E7EBF0",
    marginTop: "3px",
    paddingTop: "16px",
    height: "350px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: "100%"
  },
  resultsSuccess: {
    fontSize: "16px",
    width: "100%",
    textAlign: "center",
    color: "#748927"
  },
  landUsesContainer: {
    borderTop: "1px solid #E7EBF0",
    marginTop: "3px",
    paddingTop: "16px"
  },
  categoryText: {
    fontFamily: "Calibri",
    fontSize: "16px"
  },
  measuresContainer: {
    borderTop: "1px solid #E7EBF0",
    marginTop: "5px",
    paddingTop: "16px"
  },
  earnedPoints: {
    fontFamily: "Oswald",
    fontWeight: "500",
    fontSize: "12px",
    color: "rgba(15, 41, 64, 0.5)",
    paddingTop: "5px"
  },
  measureDetails: {
    fontFamily: "Calibri",
    fontSize: "14px",
    textAlign: "right",
    minWidth: "40px",
    marginRight: "10px"
  },
  measureUnits: {
    fontFamily: "Calibri",
    fontSize: "14px"
  },
  detailsContainer: {
    width: "150px",
    display: "flex"
  },
  pointsContainer: {
    width: "100px",
    display: "flex",
    justifyContent: "flex-end"
  }
});

const ProjectSummary = props => {
  const classes = useStyles();
  // eslint-disable-next-line
  const { rules, account, projectId, loginId, onSave } = props;

  const landUses = rules
    .filter(rule => rule.used && rule.value && rule.calculationPanelId === 5)
    .map(r => r.name)
    .join(", ");

  const getRule = code => {
    const ruleList = rules.filter(rule => rule.code === code);
    if (ruleList && ruleList[0]) {
      return ruleList[0];
    }
    return null;
  };

  const projectName = getRule("PROJECT_NAME");
  const projectAddress = getRule("PROJECT_ADDRESS");
  const projectDescription = getRule("PROJECT_DESCRIPTION");

  const parkingRequired = getRule("PARK_REQUIREMENT");
  const parkingProvided = getRule("PARK_SPACES");
  const parkingRatio = getRule("CALC_PARK_RATIO");
  const level = getRule("PROJECT_LEVEL");
  const targetPoints = getRule("TARGET_POINTS_PARK");
  const earnedPoints = getRule("PTS_EARNED");

  // Note: a rule is not effective if the value is any falsey value or "0"
  const measureRules =
    rules &&
    rules.filter(
      rule =>
        rule.category === "measure" &&
        rule.used &&
        rule.display &&
        rule.calculationPanelId !== 10 &&
        (!!(rule.value && rule.value !== "0") ||
          !!(rule.calcValue && rule.calcValue !== "0"))
    );

  const specificationRules =
    rules &&
    rules.filter(
      rule =>
        rule.category === "input" &&
        rule.used &&
        rule.display &&
        rule.calculationPanelId !== 5 &&
        rule.calculationPanelId !== 31 &&
        (!!(rule.value && rule.value !== "0") ||
          !!(rule.calcValue && rule.calcValue !== "0"))
    );

  const loading =
    !level &&
    !parkingRatio &&
    !targetPoints &&
    !earnedPoints &&
    rules &&
    !rules.length &&
    !parkingRequired &&
    !parkingProvided;

  return (
    <div className={clsx("tdm-wizard-review-page", classes.root)}>
      <h1 className="tdm-wizard-page-title">TDM Calculation Summary</h1>
      <div className={classes.lastSavedContainer}>
        <span className={classes.lastSaved}>
          <FontAwesomeIcon icon={faClock} /> &nbsp;Last saved: 6/14/20 12:56pm
        </span>
      </div>
      <div className={classes.projectInfoContainer}>
        {projectName && projectName.value ? (
          <span className={classes.textProjectInfoHeader}>
            {projectName.value}
          </span>
        ) : null}
        {projectAddress && projectAddress.value ? (
          <span className={classes.textProjectInfoHeader}>
            {" "}
            {projectAddress.value}
          </span>
        ) : null}
        {projectDescription && projectDescription.value ? (
          <p className={classes.alignCenter}>{projectDescription.value} </p>
        ) : null}
        <div className={classes.projectInfoDetailsContainer}>
          <div className={classes.projectInfoDetailsSubContainer}>
            <span className={classes.projectInfoCategory}>
              BUILDING PERMIT #
            </span>
            <span className={classes.projectInfoDetails}>2020LA51416</span>
          </div>
          <div className={classes.projectInfoDetailsSubContainer}>
            <span className={classes.projectInfoCategory}>PARCEL # (AIN)</span>
            <span className={classes.projectInfoDetails}>4239-016-006</span>
          </div>
          <div className={classes.projectInfoDetailsSubContainer}>
            <span className={classes.projectInfoCategory}>CASE #</span>
            <span className={classes.projectInfoDetails}>000000-09LK</span>
          </div>
          <div className={classes.projectInfoDetailsSubContainer}>
            <span className={classes.projectInfoCategory}>VERSION #</span>
            <span className={classes.projectInfoDetails}>005</span>
          </div>
        </div>
      </div>

      {!loading ? (
        <>
          <div className={classes.categoryContainer}>
            <span className={classes.categoryHeader}>RESULTS</span>
            <div className={clsx("space-between", classes.resultsContainer)}>
              {level ? (
                <div className={clsx("background-gray", classes.measure)}>
                  <div
                    className={classes.measureValue}
                    data-testid="summary-project-level-value"
                  >
                    {level.value}
                  </div>
                  <div
                    className={clsx(classes.alignCenter, classes.label)}
                    data-testid="summary-project-level-label"
                  >
                    {level.name}
                  </div>
                </div>
              ) : null}

              {parkingRatio ? (
                <div className={clsx("background-gray", classes.measure)}>
                  <div
                    className={classes.measureValue}
                    data-testid="summary-parking-ratio-value"
                  >
                    {`${Math.floor(parkingRatio.value).toString()}`}
                    <span className={classes.measurePercent}>%</span>
                  </div>
                  <div
                    className={clsx(classes.alignCenter, classes.label)}
                    data-testid="summary-parking-ratio-label"
                  >
                    {parkingRatio.name}
                  </div>
                </div>
              ) : null}

              {targetPoints ? (
                <div className={clsx("border-gray", classes.measure)}>
                  <div
                    className={classes.measureValue}
                    data-testid={"summary-target-points-value"}
                  >
                    {Math.round(targetPoints.value)}
                  </div>
                  <div
                    className={clsx(classes.alignCenter, classes.label)}
                    data-testid={"summary-target-points-label"}
                  >
                    {targetPoints.name}
                  </div>
                </div>
              ) : null}

              {earnedPoints ? (
                <div className={clsx("border-gray", classes.measure)}>
                  <div
                    className={classes.measureValue}
                    data-testid={"summary-earned-points-value"}
                  >
                    {Math.round(earnedPoints.value)}
                  </div>
                  <div
                    className={clsx(classes.alignCenter, classes.label)}
                    data-testid={"summary-earned-points-label"}
                  >
                    {earnedPoints.name}
                  </div>
                </div>
              ) : null}

              {Math.round(earnedPoints.value) >=
              Math.round(targetPoints.value) ? (
                <span className={classes.resultsSuccess}>
                  <FontAwesomeIcon icon={faCheckCircle} color="#748927" />{" "}
                  &nbsp;Your earned points successfully meet the target points
                </span>
              ) : null}
            </div>
          </div>

          <div className={classes.categoryContainer}>
            <span className={classes.categoryHeader}>LAND USES</span>
            <div className={classes.landUsesContainer}>
              <span className={classes.categoryText}> {`${landUses}`}</span>
            </div>
          </div>

          <div className={classes.categoryContainer}>
            <div className={clsx("space-between")}>
              <span className={classes.categoryHeader}>
                TDM MEASURES SELECTED
              </span>
              <span className={classes.earnedPoints}>EARNED POINTS</span>
            </div>
            <div className={classes.measuresContainer}>
              {rules && rules.length > 0
                ? measureRules.map(rule => (
                    <div key={rule.id} className={classes.rule}>
                      <div className={classes.ruleName}>{rule.name}</div>
                      <div className={classes.detailsContainer}></div>
                      {/* <div className={classes.value}>
                      {rule.dataType === "boolean" ? (
                        <FontAwesomeIcon icon={faCheck} />
                      ) : rule.dataType === "choice" ? (
                        rule.choices.find(
                          choice => Number(choice.id) === Number(rule.value)
                        ).name
                      ) : (
                            rule.value
                          )}
                    </div> */}
                      <div className={classes.pointsContainer}>
                        <div className={classes.value}>
                          {Math.round(rule.calcValue * 100) / 100}
                        </div>
                        <div className={classes.calcUnits}>
                          {rule.calcUnits}
                        </div>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>

          <div className={classes.categoryContainer}>
            <div className={clsx("space-between")}>
              <span className={classes.categoryHeader}>
                REQUIRED PARKING CALCULATION
              </span>
              <span className={classes.earnedPoints}>EARNED POINTS</span>
            </div>
            <div className={classes.measuresContainer}>
              {rules && rules.length > 0
                ? specificationRules.map(rule => (
                    <div key={rule.id} className={classes.rule}>
                      <div className={classes.ruleName}>{rule.name}</div>
                      <div className={classes.detailsContainer}>
                        <div className={classes.measureDetails}>
                          {rule.value}
                        </div>
                        <div className={classes.measureUnits}>{rule.units}</div>
                      </div>
                      <div
                        className={clsx(
                          Math.round(rule.calcValue * 100) / 100 === 0 &&
                            "colorGray",
                          classes.pointsContainer
                        )}
                      >
                        <div className={classes.value}>
                          {Math.round(rule.calcValue * 100) / 100}
                        </div>
                        <div className={classes.calcUnits}>pts</div>
                      </div>
                    </div>
                  ))
                : null}
              <div className={classes.measuresContainer}>
                {parkingRequired ? (
                  <div className={classes.rule}>
                    <div className={clsx(classes.wideRule, classes.bold)}>
                      {parkingRequired.name}
                    </div>
                    <div className={clsx(classes.pointsContainer)}>
                      <div className={clsx(classes.value)}>
                        {Math.round(parkingRequired.value * 100) / 100}
                      </div>
                      <div className={clsx(classes.calcUnits)}>pts</div>
                    </div>
                  </div>
                ) : null}
              </div>
              {parkingProvided ? (
                <div className={classes.rule}>
                  <div className={clsx(classes.wideRule, classes.bold)}>
                    {parkingProvided.name}
                  </div>
                  <div className={classes.pointsContainer}>
                    <div className={clsx(classes.value)}>
                      {Math.round(parkingProvided.value * 100) / 100}
                    </div>
                    <div className={clsx(classes.calcUnits)}>pts</div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <div className={classes.loaderContainer}>
          <Loader loaded={false} className="spinner" left="auto" />
        </div>
      )}
      <div className={classes.lastSavedContainer}>
        <span className={classes.lastSaved}>
          <FontAwesomeIcon icon={faClock} /> &nbsp;Last saved: 6/14/20 12:56pm
        </span>
      </div>
    </div>
  );
};
ProjectSummary.propTypes = {
  rules: PropTypes.array.isRequired,
  account: PropTypes.object.isRequired,
  projectId: PropTypes.number.isRequired,
  loginId: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired
};

export default ProjectSummary;
