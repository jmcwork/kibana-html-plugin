/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component } from 'react';

/**
 * The HtmlVisComponent renders html to HTML and presents it.
 */
class HtmlVisComponent extends Component {

  /**
   * This method will be called when props or the state has been updated, and
   * we should return whether we want the render method to be called again (true)
   * or if we know that the render method wouldn't produce anything different and
   * we don't need it to be called (false).
   *
   * We only need to render if one of the parameters used in the render function
   * actually changed. So we prevent calling render if none of it changed.
   */
  shouldComponentUpdate(props) {
    const shouldUpdate = props.html !== this.props.html;

    // If we won't update, we need to trigger the renderComplete method here,
    // since we will never render and thus never get to componentDidUpdate.
    if (!shouldUpdate) {
      this.props.renderComplete();
    }

    return shouldUpdate;
  }

  /**
   * Will be called after the first render when the component is present in the DOM.
   *
   * We call renderComplete here, to signal, that we are done with rendering.
   */
  componentDidMount() {
    this.props.renderComplete();
  }

  /**
   * Will be called after the component has been updated and the changes has been
   * flushed into the DOM.
   *
   * We will use this to signal that we are done rendering by calling the
   * renderComplete property.
   */
  componentDidUpdate() {
    this.props.renderComplete();
  }

  /**
   * Render the actual HTML.
   * Note: if only fontSize parameter has changed, this method will be called
   * and return the appropriate JSX, but React will detect, that only the
   * style argument has been updated, and thus only set this attribute to the DOM.
   */
  render() {
    return (
      <div className="html-vis">
        <div dangerouslySetInnerHTML={{__html: this.props.html}} />
      </div>
    );
  }
}

/**
 * This is a wrapper component, that is actually used as the visualization.
 * The sole purpose of this component is to extract all required parameters from
 * the properties and pass them down as separate properties to the actual component.
 * That way the actual (HtmlVisComponent) will properly trigger it's prop update
 * callback (componentWillReceiveProps) if one of these params change. It wouldn't
 * trigger otherwise (e.g. it doesn't for this wrapper), since it only triggers
 * if the reference to the prop changes (in this case the reference to vis).
 *
 * The way React works, this wrapper nearly brings no overhead, but allows us
 * to use proper lifecycle methods in the actual component.
 */
export function HtmlVisWrapper(props) {
  return (
    <HtmlVisComponent
      html={props.vis.params.html}
      renderComplete={props.renderComplete}
    />
  );
}
