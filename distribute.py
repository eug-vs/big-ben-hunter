import numpy as np
from math import floor

def win_node(node):
    return (node[0] + 1, node[1] + node[0] + 1)

def loss_node(node):
    return (0, floor(node[1] / 2))

def list_nodes(nodes, depth, node = (0,0)):
    if not node in nodes:
        nodes.append(node)

    if depth == 0:
        return

    list_nodes(nodes, depth - 1, win_node(node))
    list_nodes(nodes, depth - 1, loss_node(node))

def build_matrix(nodes):
    matrix = np.zeros((len(nodes), len(nodes)))

    for index, node in enumerate(nodes):
        row = matrix[index]

        win = win_node(node)
        loss = loss_node(node)

        if win in nodes:
            row[nodes.index(win)] = 0.75

        if loss in nodes:
            row[nodes.index(loss)] = 0.25

    # Make sure all rows add up to 1
    for n in range(len(nodes)):
        row_sum = sum(matrix[n])
        if row_sum != 1:
            matrix[n][n] = 1 - row_sum

    return matrix

def distribute(flip_count):
    nodes = []
    list_nodes(nodes, flip_count)
    print(nodes)
    matrix = build_matrix(nodes)

    distribution = np.linalg.matrix_power(matrix, flip_count)
    print(matrix)
    print(distribution)

    for node_index, node in enumerate(nodes):
        print(f"{node}: {distribution[0][node_index]}")

if __name__ == '__main__':
    distribute(7)
