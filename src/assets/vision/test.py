from engine import run, ls


def test_ls():
    print(ls())


def test_run():
    cmd_input = '[{"fn": "builtin.imread", "rid": "0", "args":["test.png"]},{"fn": "builtin.imread", "rid": "1", "args":["test.png"]}]'
    run(cmd_input)


test_ls()
test_run()
