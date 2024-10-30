import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import jsdom from 'mocha-jsdom';
import assert from 'assert';

import Modal from './../../js/components/modal';

describe('Component: Modal', () => {
  const testData = {
    title: 'Test Modal Title',
    message: 'Test Modal Text',
  };
  let testComponent;

  jsdom();

  before('setup element', () => {
    testComponent = ReactTestUtils.renderIntoDocument(
      <Modal
        message={testData.message}
        level="info"
        id="123"
        type="confirm"
        confirmText="Confim Me"
        confirm={() => { return true; }}
        hideReject={true}
        icon="file_download"
        title={testData.title} />
    );
  });

  it('is DOM component', () => {
    assert(ReactTestUtils.isDOMComponent(ReactDOM.findDOMNode(testComponent)));
  });

  it('renders correct title', () => {
    const titleComponent = ReactTestUtils.findRenderedDOMComponentWithTag(testComponent, 'h1');
    assert.equal(titleComponent.textContent, testData.title);
  });

  it('renders correct message', () => {
    const messageComponent = ReactTestUtils.findRenderedDOMComponentWithTag(testComponent, 'p');
    assert.equal(messageComponent.textContent, testData.message);
  });

  it('renders a valid close button', () => {
    const closeComponent = ReactTestUtils.findRenderedDOMComponentWithTag(testComponent, 'a');

    // It has a close anchor
    assert(ReactTestUtils.isDOMComponent(closeComponent));

    // It has a href of #close
    assert.equal(closeComponent.getAttribute('href'), '#close');

  });

  it('renders a functional confirmation button', (done) => {
    const confirmModal = ReactTestUtils.renderIntoDocument(
      <Modal
        message={testData.message}
        level="info"
        id="123"
        type="confirm"
        confirmText="Confim Me"
        confirm={() => { done() }}
        hideReject={true}
        icon="file_download"
        title={testData.title} />
    );
    const confirmationComponent = ReactTestUtils.findRenderedDOMComponentWithTag(confirmModal, 'button');

    // It executes the passed callback
    ReactTestUtils.Simulate.click(confirmationComponent)
  });
});
