import numpy as np
from matplotlib import pyplot as plt
from math import floor, sqrt

def win_node(node):
    return (node[0] + 1, node[1] + node[0] + 1)

def loss_node(node):
    return (0, floor(node[1] / 2))

def list_nodes(nodes, depth, node = (0,0)):
    if not node in nodes:
        nodes.append(node)

    if depth == 0:
        return

    list_nodes(nodes, depth - 1, loss_node(node))
    list_nodes(nodes, depth - 1, win_node(node))

def list_nodes_up_to(B):
    nodes = []
    for balance in range(B):
        for streak in range(0, floor((sqrt(balance * 8 + 1) - 1) / 2) + 1):
            nodes.append((streak, balance))
    return nodes

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

    return matrix

def distribute(flip_count):
    nodes = []
    list_nodes(nodes, flip_count)
    print(nodes)
    matrix = build_matrix(nodes)

    # Make sure all rows add up to 1
    for n in range(len(nodes)):
        row_sum = sum(matrix[n])
        if row_sum != 1:
            matrix[n][n] = 1 - row_sum

    print(matrix)

    distribution = np.linalg.matrix_power(matrix, flip_count)
    print(distribution)

    for node_index, node in enumerate(nodes):
        print(f"{node}: {distribution[0][node_index]}")

def expectation(balance, from_node=(0,0)):
    nodes = list_nodes_up_to(balance)
    print(nodes)
    matrix = build_matrix(nodes)
    print(matrix)

    A = matrix
    print(A)

    N = np.linalg.inv(np.identity(len(nodes)) - A)

    from_index = nodes.index(from_node)
    print(sum(N[from_index]))
    return sum(N[from_index])

def plot_expectation(max_b):
    x = list(range(1, max_b))
    print(x)
    y = list(expectation(balance) for balance in x)
    print(y)
    plt.plot(x, y)
    plt.show()

if __name__ == '__main__':
    plot_expectation(100)
