/*
 * Copyright 2018-2021 Elyra Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { fillPropertiesWithSavedData } from "./properties-utils";

describe("fillPropertiesWithSavedData", () => {
  it("should fill values", () => {
    const defaults = {
      current_parameters: {
        filename: "",
        runtime_image: "",
        dependencies: [],
        include_subdirectories: false,
        env_vars: [],
        outputs: [],
      },
    };
    const result = fillPropertiesWithSavedData(defaults, {
      filename: "example.ipynb",
      runtime_image: "example/runtime",
      dependencies: ["one"],
      include_subdirectories: true,
      env_vars: [],
      outputs: ["one", "two"],
    });
    expect(result.current_parameters).toStrictEqual({
      filename: "example.ipynb",
      runtime_image: "example/runtime",
      dependencies: ["one"],
      include_subdirectories: true,
      env_vars: [],
      outputs: ["one", "two"],
    });
  });

  it("handles elyra_ prefixed fields", () => {
    const defaults = {
      current_parameters: {
        label: "",
        elyra_filename: "",
        elyra_runtime_image: "",
        elyra_dependencies: [],
        elyra_include_subdirectories: false,
        elyra_env_vars: [],
        elyra_outputs: [],
      },
    };
    const result = fillPropertiesWithSavedData(defaults, {
      label: "My Label",
      component_parameters: {
        filename: "example.ipynb",
        runtime_image: "example/runtime",
        dependencies: ["one"],
        include_subdirectories: true,
        env_vars: [],
        outputs: ["one", "two"],
      },
    });
    expect(result.current_parameters).toStrictEqual({
      label: "My Label",
      elyra_filename: "example.ipynb",
      elyra_runtime_image: "example/runtime",
      elyra_dependencies: ["one"],
      elyra_include_subdirectories: true,
      elyra_env_vars: [],
      elyra_outputs: ["one", "two"],
    });
  });

  it("should replace defaults with undefined", () => {
    const defaults = {
      current_parameters: {
        example: "<default-value>",
      },
    };

    const filled = fillPropertiesWithSavedData(defaults, {
      example: "<manual-value>",
    });
    expect(filled).toStrictEqual({
      current_parameters: {
        example: "<manual-value>",
      },
    });

    const cleared = fillPropertiesWithSavedData(defaults, {
      example: undefined,
    });
    expect(cleared).toStrictEqual({
      current_parameters: {
        example: undefined,
      },
    });
  });
});
