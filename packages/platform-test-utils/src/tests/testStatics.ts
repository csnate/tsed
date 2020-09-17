import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import {readFileSync} from "fs";
import * as SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

export function testStatics(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  beforeEach(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/": []
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterEach(PlatformTest.reset);

  it("should return index HTML (1)", async () => {
    const response = await request.get("/").expect(200);

    expect(response.text).to.equal(readFileSync(`${options.rootDir}/public/index.html`, {encoding: "utf8"}));
  });

  it("should return index HTML (2)", async () => {
    const response = await request.get("/index.html").expect(200);

    expect(response.text).to.equal(readFileSync(`${options.rootDir}/public/index.html`, {encoding: "utf8"}));
  });

  it("should return 404", async () => {
    const response = await request.get("/index-te.html").expect(404);

    expect(response.body).to.deep.equal({
      errors: [],
      message: "Resource \"/index-te.html\" not found",
      name: "NOT_FOUND",
      status: 404
    });
  });
}
