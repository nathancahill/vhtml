import h from '../src/vhtml';
import stringify from '../src/stringify';
import { expect } from 'chai';
/** @jsx h */
/*global describe,it*/

describe('vhtml', () => {
	it('should stringify html', () => {
		let items = ['one', 'two', 'three'];
		expect(
			<div class="foo">
				<h1>Hi!</h1>
				<p>Here is a list of {items.length} items:</p>
				<ul>
					{ items.map( item => (
						<li>{ item }</li>
					)) }
				</ul>
			</div>
		).to.equal(
			`<div class="foo"><h1>Hi!</h1><p>Here is a list of 3 items:</p><ul><li>one</li><li>two</li><li>three</li></ul></div>`
		);
	});

	it('should sanitize children', () => {
		expect(
			<div>
				{ `<strong>blocked</strong>` }
				<em>allowed</em>
			</div>
		).to.equal(
			`<div>&lt;strong&gt;blocked&lt;/strong&gt;<em>allowed</em></div>`
		);
	});

	it('should sanitize attributes', () => {
		expect(
			<div onclick={`&<>"'`} />
		).to.equal(
			`<div onclick="&amp;&lt;&gt;&quot;&apos;"></div>`
		);
	});

	it('should flatten children', () => {
		expect(
			<div>
				{[['a','b']]}
				<c>d</c>
				{['e',['f'],[['g']]]}
			</div>
		).to.equal(
			`<div>ab<c>d</c>efg</div>`
		);
	});

	it('should support sortof components', () => {
		let items = ['one', 'two'];

		const Item = ({ item, index, children }) => (
			<li id={index}>
				<h4>{item}</h4>
				{children}
			</li>
		);

		expect(
			<div class="foo">
				<h1>Hi!</h1>
				<ul>
					{ items.map( (item, index) => (
						<Item {...{ item, index }}>
							This is item {item}!
						</Item>
					)) }
				</ul>
			</div>
		).to.equal(
			`<div class="foo"><h1>Hi!</h1><ul><li id="0"><h4>one</h4>This is item one!</li><li id="1"><h4>two</h4>This is item two!</li></ul></div>`
		);
	});

	it('should support sortof components without args', () => {
	  let items = ['one', 'two'];

	  const Item = () => (
	    <li>
	      <h4></h4>
	    </li>
	  );

	  expect(
	    <div class="foo">
	      <h1>Hi!</h1>
	      <ul>
	        { items.map( (item, index) => (
	          <Item>
	            This is item {item}!
	          </Item>
	        )) }
	      </ul>
	    </div>
	  ).to.equal(
	    `<div class="foo"><h1>Hi!</h1><ul><li><h4></h4></li><li><h4></h4></li></ul></div>`
	  );
	});

	it('should support sortof components without args but with children', () => {
	  let items = ['one', 'two'];

	  const Item = ({ children }) => (
	    <li>
	      <h4></h4>
	      {children}
	    </li>
	  );

	  expect(
	    <div class="foo">
	      <h1>Hi!</h1>
	      <ul>
	        { items.map( (item, index) => (
	          <Item>
	            This is item {item}!
	          </Item>
	        )) }
	      </ul>
	    </div>
	  ).to.equal(
	    `<div class="foo"><h1>Hi!</h1><ul><li><h4></h4>This is item one!</li><li><h4></h4>This is item two!</li></ul></div>`
	  );
	});

	it('should support empty (void) tags', () => {
		expect(
			<div>
				<area />
				<base />
				<br />
				<col />
				<command />
				<embed />
				<hr />
				<img />
				<input />
				<keygen />
				<link />
				<meta />
				<param />
				<source />
				<track />
				<wbr />
				{/* Not void elements */}
				<div />
				<span />
				<p />
			</div>
		).to.equal(
			`<div><area><base><br><col><command><embed><hr><img><input><keygen><link><meta><param><source><track><wbr><div></div><span></span><p></p></div>`
		);
	});

	it('should handle special prop names', () => {
		expect(
			<div className="my-class" htmlFor="id" />
		).to.equal(
			'<div class="my-class" for="id"></div>'
		);
	});

	it('should support unsafe html', () => {
		expect(
			stringify('div', {}, ['<span>test</span>'], false)
		).to.equal(
			'<div>&lt;span&gt;test&lt;/span&gt;</div>'
		);

		expect(
			stringify('div', {}, ['<span>test</span>'], true)
		).to.equal(
			'<div><span>test</span></div>'
		);
	});
});
