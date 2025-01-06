import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import { assert } from 'chai';



describe("HTML Element and Attribute Validation", () => {
  let passedAssertions;
  let failedAssertions;
  let totalTests;
  let document;

  beforeEach(async () => {
    passedAssertions = 0;
    failedAssertions = 0;
    totalTests = 0;

    const response = await fetch("http://localhost:3000/"); // Replace with your server URL
    const body = await response.text();

    const dom = new JSDOM(body);
    document = dom.window.document;
  });

  function attrsChecker(elem, attrs) {
    attrs.forEach((attr) => {
      totalTests += 1;
      const attrValue = elem.getAttribute(attr);
      try {
        assert.isTrue(attrValue !== null, `Element <${elem.tagName}> should have attribute '${attr}'`);
        assert.isNotEmpty(attrValue, `Attribute '${attr}' on <${elem.tagName}> should not be empty`);
        passedAssertions += 1;
      } catch (error) {
        failedAssertions += 1;
        console.error(`Test failed: ${error.message}`);
      }
    });
  }

  function checkContainer(elem) {
    totalTests += 1;
    try {
      assert.isNotNull(elem.children, `<${elem.tagName}> should have child elements`);
      assert.isTrue(elem.children.length > 0, `<${elem.tagName}> should not be empty`);
      passedAssertions += 1;
    } catch (error) {
      failedAssertions += 1;
      console.error(`Test failed: ${error.message}`);
    }
  }

  it("Validates elements and attributes in the HTML file", () => {
    // Testing <a> elements
    const aElements = document.querySelectorAll("a");
    aElements.forEach((a) => {
      attrsChecker(a, ["href"]);
    });

    // Testing <nav> elements
    const navElements = document.querySelectorAll("nav");
    navElements.forEach((nav) => {
      attrsChecker(nav, ["class"]);
      checkContainer(nav);
    });

    // Testing <section> elements
    const sectionElements = document.querySelectorAll("section");
    sectionElements.forEach((section) => {
      attrsChecker(section, ["id", "class"]);
      checkContainer(section);
    });

    // Testing <img> elements
    const imgElements = document.querySelectorAll("img");
    imgElements.forEach((img) => {
      attrsChecker(img, ["src", "alt"]);
    });

    // Testing <ul> and <li> elements
    const ulElements = document.querySelectorAll("ul");
    ulElements.forEach((ul) => {
      checkContainer(ul);
    });

    const liElements = document.querySelectorAll("li");
    liElements.forEach((li) => {
      checkContainer(li);
    });

    // Testing <footer>
    const footerElements = document.querySelectorAll("footer");
    footerElements.forEach((footer) => {
      checkContainer(footer);
    });

    // Additional elements as needed
    const hOneElements = document.querySelectorAll("h1");
    hOneElements.forEach((h1) => {
      attrsChecker(h1, ["class"]);
    });
  });

  afterEach(() => {
    const percentage = (passedAssertions / totalTests) * 100;
    const grade =
      percentage >= 90
        ? "A"
        : percentage >= 80
        ? "B"
        : percentage >= 70
        ? "C"
        : percentage >= 60
        ? "D"
        : "F";

    console.log(
      `Total tests: ${totalTests}, Passed: ${passedAssertions}, Failed: ${failedAssertions}, Percentage: ${percentage.toFixed(
        2
      )}%, Grade: ${grade}`
    );
  });
});
