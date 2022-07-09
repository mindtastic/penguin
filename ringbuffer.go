package main

import "sync"

type RingBuffer struct {
	mu    sync.RWMutex
	buf   []ServiceMap
	size  int
	read  int
	write int
}

func NewBuffer(size int) *RingBuffer {
	return &RingBuffer{
		buf:  make([]ServiceMap, size),
		size: size,
	}
}

func (b *RingBuffer) Len() int {
	return b.write % b.size
}

func (b *RingBuffer) Size() int {
	return b.size
}

func (b *RingBuffer) Write(s ServiceMap) {
	b.mu.Lock()
	b.buf[b.write] = s
	b.write = (b.write + 1) % b.size
	b.mu.Unlock()
}

func (b *RingBuffer) WriteAt(index int, s ServiceMap) {
	b.mu.Lock()
	b.buf[(index+b.size)%b.size] = s
	b.write = (b.write + 1) % b.size
	b.mu.Unlock()
}

func (b *RingBuffer) Read() ServiceMap {
	b.mu.Lock()
	s := b.buf[b.read]
	b.read = (b.read + 1) % b.size
	b.mu.Unlock()
	return s
}

func (b *RingBuffer) ReadAt(index int) ServiceMap {
	b.mu.Lock()
	s := b.buf[(index+b.size)%b.size]
	b.read = (b.read + 1) % b.size
	b.mu.Unlock()
	return s
}
