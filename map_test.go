package main

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

type addPathEdgeInput struct {
	path string
	from string
	to   string
	attr map[string][]string
}

func TestServiceMap_AddPathEdge(t *testing.T) {
	testCases := []struct {
		name     string
		before   ServiceMap
		input    []addPathEdgeInput
		expected ServiceMap
	}{
		{name: "none", before: NewServiceMap(), input: []addPathEdgeInput{}, expected: NewServiceMap()},
		{name: "add first", before: NewServiceMap(), input: []addPathEdgeInput{{from: "src", to: "dst", path: "path", attr: nil}},
			expected: ServiceMap{
				Nodes: []Node{},
				Edges: []Edge{
					{
						From:       "src",
						To:         "dst",
						Attributes: nil,
					},
				},
				Paths: map[string]Path{
					"path": {
						Edges: []Edge{
							{
								From:       "src",
								To:         "dst",
								Attributes: nil,
							},
						},
						RequestRate: 0,
						Attributes:  map[string][]string{},
					},
				},
			}},
		{name: "add first with attributes", before: NewServiceMap(), input: []addPathEdgeInput{{from: "src", to: "dst", path: "path", attr: map[string][]string{"test": {"testing"}}}},
			expected: ServiceMap{
				Nodes: []Node{},
				Edges: []Edge{
					{
						From:       "src",
						To:         "dst",
						Attributes: map[string][]string{"test": {"testing"}},
					},
				},
				Paths: map[string]Path{
					"path": {
						Edges: []Edge{
							{
								From:       "src",
								To:         "dst",
								Attributes: map[string][]string{"test": {"testing"}},
							},
						},
						RequestRate: 0,
						Attributes:  map[string][]string{"test": {"testing"}},
					},
				},
			}},
		{name: "add many", before: NewServiceMap(), input: []addPathEdgeInput{
			{from: "src", to: "dst", path: "path", attr: nil},
			{from: "src1", to: "dst1", path: "path", attr: nil},
			{from: "src2", to: "dst2", path: "path", attr: nil},
			{from: "src3", to: "dst3", path: "path", attr: nil},
			{from: "src4", to: "dst4", path: "path", attr: nil},
		},
			expected: ServiceMap{
				Nodes: []Node{},
				Edges: []Edge{
					{From: "src", To: "dst", Attributes: nil},
					{From: "src1", To: "dst1", Attributes: nil},
					{From: "src2", To: "dst2", Attributes: nil},
					{From: "src3", To: "dst3", Attributes: nil},
					{From: "src4", To: "dst4", Attributes: nil},
				},
				Paths: map[string]Path{
					"path": {
						Edges: []Edge{
							{From: "src", To: "dst", Attributes: nil},
							{From: "src1", To: "dst1", Attributes: nil},
							{From: "src2", To: "dst2", Attributes: nil},
							{From: "src3", To: "dst3", Attributes: nil},
							{From: "src4", To: "dst4", Attributes: nil},
						},
						RequestRate: 0,
						Attributes:  map[string][]string{},
					},
				},
			}},
		{name: "add many override partial", before: NewServiceMap(), input: []addPathEdgeInput{
			{from: "src", to: "dst", path: "path", attr: nil},
			{from: "src", to: "dst1", path: "path", attr: nil},
			{from: "dst", to: "dst2", path: "path", attr: nil},
		},
			expected: ServiceMap{
				Nodes: []Node{},
				Edges: []Edge{
					{From: "src", To: "dst", Attributes: nil},
					{From: "src", To: "dst1", Attributes: nil},
					{From: "dst", To: "dst2", Attributes: nil},
				},
				Paths: map[string]Path{
					"path": {
						Edges: []Edge{
							{From: "src", To: "dst", Attributes: nil},
							{From: "src", To: "dst1", Attributes: nil},
							{From: "dst", To: "dst2", Attributes: nil},
						},
						RequestRate: 0,
						Attributes:  map[string][]string{},
					},
				},
			}},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			for _, i := range tc.input {
				tc.before.AddPathEdge(i.path, i.from, i.to, i.attr)
			}
			assert.Equal(t, tc.expected, tc.before)
		})
	}
}
