import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import jsdom from 'mocha-jsdom';
import assert from 'assert';

import Search from './../../js/components/search';

describe('Component: Search', () => {
  const testUser = {
    "id":"X5PMGcvPFY",
    "first_name":"Test",
    "last_name":"McTesterson",
    "profile_name":"",
    "email":"test@shutterstock.com",
    "subscriptions":[
      {
        "id":"51a3ecf1a42e4c3d8994ebc895e9402f",
        "type":"video",
        "plan":"5-video-1days",
        "credits":5,
        "total_credits":5,
        "expires_at":"2016-01-09T19:17:58.000Z",
        "renews_at":"2015-12-16T19:17:58.000Z"
      },
      {
        "id":"54dfc854dcf54a31afe50d0f1174c504",
        "type":"image",
        "plan":"999-image-1days",
        "credits":999,
        "total_credits":999,
        "expires_at":"2016-01-09T19:17:09.000Z",
        "renews_at":"2015-12-16T19:17:58.000Z"
      }
    ]
  };
  const testToken = '123';
  let testComponent;

  jsdom();

  before('setup search', () => {
    testComponent = ReactTestUtils.renderIntoDocument(
      <Search vw={920} user={testUser} token={testToken} />
    );
  });

  it('is DOM component', () => {
    assert(ReactTestUtils.isDOMComponent(ReactDOM.findDOMNode(testComponent)));
  });
});
