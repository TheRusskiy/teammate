import * as shell from "shelljs";

shell.rm("-rf", "../frontend/src/shared");
shell.cp("-R", "src/shared", "../frontend/src");