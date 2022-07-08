package main

import "sync"

type MapBuffer struct {
	mu    sync.RWMutex
	buf   []*ServiceMap
	size  int
	read  int
	write int
}

func NewBuffer(size int) *MapBuffer {
	return &MapBuffer{
		buf:  make([]*ServiceMap, 0, size),
		size: size,
	}
}

func (b *MapBuffer) WriteAt(index int, s *ServiceMap) {
	b.mu.Lock()
	b.write = index % b.size
	b.append(s)
	b.mu.Unlock()
}

func (b *MapBuffer) append(s *ServiceMap) {
	b.buf[b.write] = s
}

func (b *MapBuffer) ReadAt(index int) *ServiceMap {
	b.mu.Lock()
	b.read = index % b.size
	s := b.buf[b.read]
	b.mu.Unlock()
	return s
}
