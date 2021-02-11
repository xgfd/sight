import json
import shlex
from engine import run, ls, _parse_and_exec, export


def test_ls():
    print(ls())


def test_run():

    cmd_input = json.dumps(
        [
            {"fn": "builtin.imread", "rid": "0", "args": ["test.png", 0]},
            {"fn": "builtin.canny", "rid": "1", "args": [[80, 120], 3, False]},
            {"fn": "builtin.imread", "rid": "2", "args": ["test.png", 0]},
        ]
    )
    run(cmd_input)
    cmd_input = json.dumps(
        [
            {
                "fn": "builtin.canny",
                "last_hash": "9c41a9c17c4882da1f5bfe1a8c045ab498dae04ade52e99258209fec596c3822",
                "rid": "1",
                "args": [[80, 120], 3, False],
            },
            {"fn": "builtin.imread", "rid": "2", "args": ["test.png", -1]},
        ]
    )
    run(cmd_input)


def test_export():
    operations = [
        {"fn": "builtin.GaussianBlur", "args": [3, 3, 0, 0, 0]},
        {
            "fn": "custom.custom3",
            "args": [[50, 150], 3, 3, 0, 0, "a", False],
        },
    ]
    export(operations)


def test_parse_and_exec():
    instructions = [
        {"fn": "builtin.imread", "rid": "0", "args": ["test.png", 0]},
        {"fn": "builtin.canny", "rid": "1", "args": [[80, 120], 3, False]},
        {"fn": "builtin.imread", "rid": "2", "args": ["test.png", 0]},
    ]
    cmd = shlex.join(["run", json.dumps(instructions)])
    print("cmd", cmd)
    _parse_and_exec(cmd)

    cmd = 'upsert "custom.custom1"'
    print("cmd", cmd)
    _parse_and_exec(cmd)


if __name__ == "__main__":
    # test_ls()
    # test_run()
    # test_parse_and_exec()
    test_export()
