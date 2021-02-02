import json
from engine import run, ls


def test_ls():
    print(ls())


def test_run():

    cmd_input = json.dumps(
        [
            {"fn": "builtin.imread", "rid": "0", "args": ["test.png"]},
            {"fn": "builtin.canny", "rid": "1", "args": [[80, 120], 3]},
            {"fn": "builtin.imread", "rid": "2", "args": ["test.png"]},
        ]
    )
    run(cmd_input)
    cmd_input = json.dumps(
        [
            {
                "fn": "builtin.canny",
                "last_hash": "3a05b27192257bee0c7df3b630b83b3ea4a4c0ad9ab257d41b812472867b4df0",
                "rid": "1",
                "args": [[80, 120], 3],
            },
            {"fn": "builtin.imread", "rid": "2", "args": ["test.png"]},
        ]
    )
    run(cmd_input)


if __name__ == "__main__":
    test_ls()
    test_run()
