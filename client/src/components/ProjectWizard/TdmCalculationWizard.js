import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import ToastContext from "../../contexts/Toast/ToastContext";
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import { withRouter } from "react-router-dom";
import TermsAndConditionsModal from "../TermsAndConditionsModal";
import CalculationWizardRoutes from "./CalculationWizardRoutes";
import WizardFooter from "./WizardFooter";
import WizardSidebar from "./WizardSidebar/WizardSidebar";

const useStyles = createUseStyles({
  root: {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "row"
  },
  "@media (max-width:768px)": {
    root: {
      flexDirection: "column"
    }
  },
  contentContainer: {
    justifyContent: "space-between",
    boxSizing: "border-box",
    overflow: "auto"
  }
});

const TdmCalculationWizard = props => {
  const {
    projectLevel,
    rules,
    onInputChange,
    onCommentChange,
    onUncheckAll,
    initializeStrategies,
    filters,
    onPkgSelect,
    resultRuleCodes,
    account,
    loginId,
    onSave,
    onViewChange,
    history,
    match,
    allowResidentialPackage,
    allowEmploymentPackage,
    residentialPackageSelected,
    employmentPackageSelected,
    formIsDirty,
    projectIsValid,
    dateModified,
    tdmWizardContentContainerRef
  } = props;
  const context = useContext(ToastContext);
  const classes = useStyles();
  const page = Number(match.params.page || 1);
  const projectId = Number(match.params.projectId);

  useEffect(() => {
    if (!projectId) {
      history.push("/calculation/1");
    } else if (projectId && (!account || !account.id)) {
      // user not logged in, existing project -> log in
      history.push(`/login`);
    } else if (
      // Redirect to Summary Page if project exists,
      // but does not belong to logged-in user
      // Note: For an existing project, this effect
      // gets called once with loginId = 0 before the
      // component is re-created with the correct loginId,
      // so we only want to re-direct after the loginId
      // is properly set.
      projectId &&
      loginId &&
      !(account.isAdmin || account.id === loginId)
    ) {
      history.push(`/calculation/6/${projectId}`);
    }
  }, [projectId, account, loginId, history]);

  const projectDescriptionRules =
    rules && rules.filter(filters.projectDescriptionRules);
  const landUseRules = rules && rules.filter(filters.landUseRules);
  const specificationRules = rules && rules.filter(filters.specificationRules);
  const targetPointRules = rules && rules.filter(filters.targetPointRules);
  const strategyRules = rules && rules.filter(filters.strategyRules);
  const resultRules =
    rules &&
    rules.filter(rule => resultRuleCodes.includes(rule.code) && rule.display);

  const isLevel0 = projectLevel === 0;

  const setDisabledForNextNavButton = () => {
    const isPage1AndHasErrors =
      page === 1 &&
      projectDescriptionRules.find(rule => !!rule.validationErrors);
    const isPage2AndHasErrors =
      page === 2 && specificationRules.find(rule => !!rule.validationErrors);
    const isPage5AndHasErrors =
      page === 5 && strategyRules.find(rule => !!rule.validationErrors);
    const isPage6 = Number(page) === 6;

    return !!(
      isPage1AndHasErrors ||
      isPage2AndHasErrors ||
      isPage5AndHasErrors ||
      isPage6
    );
  };

  const pageNumber = isLevel0 && page === 3 ? 5 : page <= 3 ? page : page - 1;

  const handleValidate = () => {
    const { page } = match.params;
    const validations = {
      1: {
        function: () => {
          return !projectDescriptionRules.find(rule => !!rule.validationErrors);
        },
        toast: "Please fill out all required fields"
      }
    };
    const result = validations[page] ? validations[page].function() : true;
    if (result === false) {
      context.add(validations[page].toast);
      return false;
    } else {
      return true;
    }
  };

  const onPageChange = pageNo => {
    const { page, projectId } = match.params;
    const projectIdParam = projectId ? `/${projectId}` : "";
    if (Number(pageNo) > Number(match.params.page)) {
      if (handleValidate()) {
        // Skip page 4 unless Packages are applicable
        const nextPage =
          Number(page) === 3 &&
          !allowResidentialPackage &&
          !allowEmploymentPackage
            ? 5
            : Number(page) + 1;
        history.push(`/calculation/${nextPage}${projectIdParam}`);
      }
    } else {
      // Skip page 4 unless Packages are applicable
      const prevPage =
        Number(page) === 5 &&
        !allowResidentialPackage &&
        !allowEmploymentPackage
          ? 3
          : Number(page) - 1;
      history.push(`/calculation/${prevPage}${projectIdParam}`);
    }
  };

  return (
    <React.Fragment>
      <TermsAndConditionsModal />
      <div className={clsx("tdm-wizard", classes.root)}>
        <WizardSidebar
          rules={rules}
          onViewChange={onViewChange}
          resultRules={resultRules}
        />
        <div
          className={clsx(
            "tdm-wizard-content-container",
            classes.contentContainer
          )}
          ref={tdmWizardContentContainerRef}
        >
          <CalculationWizardRoutes
            projectDescriptionRules={projectDescriptionRules}
            onInputChange={onInputChange}
            classes={classes}
            specificationRules={specificationRules}
            onUncheckAll={onUncheckAll}
            filters={filters}
            targetPointRules={targetPointRules}
            isLevel0={isLevel0}
            projectLevel={projectLevel}
            strategyRules={strategyRules}
            landUseRules={landUseRules}
            allowResidentialPackage={allowResidentialPackage}
            allowEmploymentPackage={allowEmploymentPackage}
            onCommentChange={onCommentChange}
            initializeStrategies={initializeStrategies}
            onPkgSelect={onPkgSelect}
            residentialPackageSelected={residentialPackageSelected}
            employmentPackageSelected={employmentPackageSelected}
            rules={rules}
            account={account}
            projectId={projectId}
            loginId={loginId}
            onSave={onSave}
            dateModified={dateModified}
          />
          <WizardFooter
            rules={rules}
            page={page}
            onPageChange={onPageChange}
            pageNumber={pageNumber}
            setDisabledForNextNavButton={setDisabledForNextNavButton}
            account={account}
            projectId={projectId}
            loginId={loginId}
            formIsDirty={formIsDirty}
            projectIsValid={projectIsValid}
            onSave={onSave}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

TdmCalculationWizard.propTypes = {
  tdmWizardContentContainerRef: PropTypes.object,
  projectLevel: PropTypes.number,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      dataType: PropTypes.string.isRequired,
      value: PropTypes.any,
      units: PropTypes.string,
      minValue: PropTypes.number,
      maxValue: PropTypes.number,
      choices: PropTypes.array,
      calcValue: PropTypes.number,
      calcUnits: PropTypes.string,
      required: PropTypes.bool,
      minStringLength: PropTypes.number,
      maxStringLength: PropTypes.number,
      validationErrors: PropTypes.array
    })
  ).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      page: PropTypes.string,
      projectId: PropTypes.string
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  onInputChange: PropTypes.func.isRequired,
  onCommentChange: PropTypes.func,
  onPkgSelect: PropTypes.func.isRequired,
  initializeStrategies: PropTypes.func.isRequired,
  onUncheckAll: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  resultRuleCodes: PropTypes.array.isRequired,
  account: PropTypes.object.isRequired,
  loginId: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  onViewChange: PropTypes.func.isRequired,
  allowResidentialPackage: PropTypes.bool.isRequired,
  allowEmploymentPackage: PropTypes.bool.isRequired,
  residentialPackageSelected: PropTypes.func,
  employmentPackageSelected: PropTypes.func,
  formIsDirty: PropTypes.bool,
  projectIsValid: PropTypes.func,
  dateModified: PropTypes.string
};

export default withRouter(TdmCalculationWizard);
