/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import deepEqual from 'fast-deep-equal';

import { useKibana } from '../../lib/kibana';
import { RouteSpyState } from '../../utils/route/types';
import { useRouteSpy } from '../../utils/route/use_route_spy';
import { makeMapStateToProps } from '../url_state/helpers';
import { setBreadcrumbs } from './breadcrumbs';
import { TabNavigation } from './tab_navigation';
import { SiemNavigationProps, SiemNavigationComponentProps } from './types';

export const SiemNavigationComponent: React.FC<
  SiemNavigationComponentProps & SiemNavigationProps & RouteSpyState
> = ({
  detailName,
  display,
  navTabs,
  pageName,
  pathName,
  search,
  tabName,
  urlState,
  flowTarget,
  state,
}) => {
  const {
    chrome,
    application: { getUrlForApp },
  } = useKibana().services;

  useEffect(() => {
    if (pathName || pageName) {
      setBreadcrumbs(
        {
          detailName,
          filters: urlState.filters,
          flowTarget,
          navTabs,
          pageName,
          pathName,
          query: urlState.query,
          savedQuery: urlState.savedQuery,
          search,
          sourcerer: urlState.sourcerer,
          state,
          tabName,
          timeline: urlState.timeline,
          timerange: urlState.timerange,
        },
        chrome,
        getUrlForApp
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chrome, pageName, pathName, search, navTabs, urlState, state]);

  return (
    <TabNavigation
      query={urlState.query}
      display={display}
      filters={urlState.filters}
      navTabs={navTabs}
      pageName={pageName}
      pathName={pathName}
      sourcerer={urlState.sourcerer}
      savedQuery={urlState.savedQuery}
      tabName={tabName}
      timeline={urlState.timeline}
      timerange={urlState.timerange}
    />
  );
};

export const SiemNavigationRedux = compose<
  React.ComponentClass<SiemNavigationProps & RouteSpyState>
>(connect(makeMapStateToProps))(
  React.memo(
    SiemNavigationComponent,
    (prevProps, nextProps) =>
      prevProps.pathName === nextProps.pathName &&
      prevProps.search === nextProps.search &&
      deepEqual(prevProps.navTabs, nextProps.navTabs) &&
      deepEqual(prevProps.urlState, nextProps.urlState) &&
      deepEqual(prevProps.state, nextProps.state)
  )
);

const SiemNavigationContainer: React.FC<SiemNavigationProps> = (props) => {
  const [routeProps] = useRouteSpy();
  const stateNavReduxProps: RouteSpyState & SiemNavigationProps = {
    ...routeProps,
    ...props,
  };

  return <SiemNavigationRedux {...stateNavReduxProps} />;
};

export const SiemNavigation = SiemNavigationContainer;
